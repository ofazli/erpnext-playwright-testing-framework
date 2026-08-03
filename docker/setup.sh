#!/usr/bin/env bash
set -Eeuo pipefail

BENCH_DIR="${BENCH_DIR:-/workspace/frappe-bench}"
ERPNext_DIR="/workspace/erpnext"
SITE_NAME="${SITE_NAME:-erpnext.localhost}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin}"
DB_ROOT_PASSWORD="${DB_ROOT_PASSWORD:-123}"

sudo mkdir -p "$BENCH_DIR"
sudo chown -R frappe:frappe "$BENCH_DIR"
sudo mkdir -p "$ERPNext_DIR/node_modules" "$ERPNext_DIR/banking/node_modules"
sudo chown -R frappe:frappe "$ERPNext_DIR/node_modules" "$ERPNext_DIR/banking/node_modules"

if [[ ! -d "$BENCH_DIR/apps/frappe" ]]; then
	bench init \
		--ignore-exist \
		--skip-redis-config-generation \
		--frappe-path https://github.com/frappe/frappe.git \
		--frappe-branch develop \
		--python python3.14 \
		"$BENCH_DIR"
fi

cd "$BENCH_DIR"

sudo rmdir /sites 2>/dev/null || true
sudo ln -sfn "$BENCH_DIR/sites" /sites

bench set-config -g db_host mariadb
bench set-config -g db_port 3306
bench set-config -g redis_cache redis://redis-cache:6379
bench set-config -g redis_queue redis://redis-queue:6379
bench set-config -g redis_socketio redis://redis-queue:6379
bench set-config -gp developer_mode 1

if [[ -e apps/erpnext && ! -L apps/erpnext ]]; then
	echo "apps/erpnext zaten var fakat bu çalışma alanına bağlı değil." >&2
	exit 1
fi

ln -sfn "$ERPNext_DIR" apps/erpnext
bench pip install --editable "$ERPNext_DIR"
yarn --cwd "$ERPNext_DIR" install --frozen-lockfile

printf "frappe\nerpnext\n" > sites/apps.txt

bench build --app erpnext

if [[ ! -f "sites/$SITE_NAME/site_config.json" ]]; then
	bench new-site "$SITE_NAME" \
		--db-type mariadb \
		--db-host mariadb \
		--db-root-username root \
		--db-root-password "$DB_ROOT_PASSWORD" \
		--admin-password "$ADMIN_PASSWORD" \
		--mariadb-user-host-login-scope=% \
		--install-app erpnext
elif ! bench --site "$SITE_NAME" list-apps --format text | grep -qxF erpnext; then
	bench --site "$SITE_NAME" install-app erpnext
fi

bench --site "$SITE_NAME" set-config developer_mode 1
bench --site "$SITE_NAME" clear-cache
bench use "$SITE_NAME"
