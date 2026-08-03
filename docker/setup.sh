#!/usr/bin/env bash

set -Eeuo pipefail

BENCH_DIR="${BENCH_DIR:-/workspace/frappe-bench}"
ERPNEXT_DIR="${ERPNEXT_DIR:-/workspace/erpnext}"

SITE_NAME="${SITE_NAME:-erpnext.localhost}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin}"
DB_ROOT_PASSWORD="${DB_ROOT_PASSWORD:-123}"

FRAPPE_BRANCH="${FRAPPE_BRANCH:-develop}"
PYTHON_VERSION="${PYTHON_VERSION:-python3.14}"

COMPANY_NAME="${COMPANY_NAME:-Automation Company}"
COMPANY_ABBR="${COMPANY_ABBR:-AC}"
COUNTRY="${COUNTRY:-Canada}"
TIMEZONE="${TIMEZONE:-America/Toronto}"
CURRENCY="${CURRENCY:-CAD}"

export ADMIN_PASSWORD
export COMPANY_NAME
export COMPANY_ABBR
export COUNTRY
export TIMEZONE
export CURRENCY

log() {
	echo
	echo "=================================================="
	echo "$1"
	echo "=================================================="
}

log "Preparing directories"

sudo mkdir -p "$BENCH_DIR"
sudo chown -R frappe:frappe "$BENCH_DIR"

sudo mkdir -p \
	"$ERPNEXT_DIR/node_modules" \
	"$ERPNEXT_DIR/banking/node_modules"

sudo chown -R frappe:frappe \
	"$ERPNEXT_DIR/node_modules" \
	"$ERPNEXT_DIR/banking/node_modules"

if [[ ! -d "$BENCH_DIR/apps/frappe" ]]; then
	log "Initializing Frappe bench"

	bench init \
		--ignore-exist \
		--skip-redis-config-generation \
		--frappe-path https://github.com/frappe/frappe.git \
		--frappe-branch "$FRAPPE_BRANCH" \
		--python "$PYTHON_VERSION" \
		"$BENCH_DIR"
else
	log "Existing Frappe bench found"
fi

cd "$BENCH_DIR"

log "Configuring sites directory"

sudo rmdir /sites 2>/dev/null || true
sudo ln -sfn "$BENCH_DIR/sites" /sites

log "Configuring database and Redis connections"

bench set-config -g db_host mariadb
bench set-config -g db_port 3306
bench set-config -g redis_cache redis://redis-cache:6379
bench set-config -g redis_queue redis://redis-queue:6379
bench set-config -g redis_socketio redis://redis-queue:6379
bench set-config -gp developer_mode 1

log "Linking ERPNext source code"

if [[ -e "$BENCH_DIR/apps/erpnext" && ! -L "$BENCH_DIR/apps/erpnext" ]]; then
	echo "ERROR: apps/erpnext exists but is not a symbolic link." >&2
	exit 1
fi

ln -sfn "$ERPNEXT_DIR" "$BENCH_DIR/apps/erpnext"

log "Installing ERPNext Python dependencies"

bench pip install --editable "$ERPNEXT_DIR"

log "Installing ERPNext Node dependencies"

yarn \
	--cwd "$ERPNEXT_DIR" \
	install \
	--frozen-lockfile

printf "frappe\nerpnext\n" > "$BENCH_DIR/sites/apps.txt"

log "Building ERPNext assets"

bench build --app erpnext

if [[ ! -f "$BENCH_DIR/sites/$SITE_NAME/site_config.json" ]]; then
	log "Creating site: $SITE_NAME"

	bench new-site "$SITE_NAME" \
		--db-type mariadb \
		--db-host mariadb \
		--db-root-username root \
		--db-root-password "$DB_ROOT_PASSWORD" \
		--admin-password "$ADMIN_PASSWORD" \
		--mariadb-user-host-login-scope=% \
		--install-app erpnext
else
	log "Existing site found: $SITE_NAME"

	if ! bench \
		--site "$SITE_NAME" \
		list-apps \
		--format text |
		grep -qxF erpnext; then

		log "Installing ERPNext on existing site"

		bench \
			--site "$SITE_NAME" \
			install-app erpnext
	fi
fi

log "Completing ERPNext Setup Wizard"

CI_SETUP_MODULE="$ERPNEXT_DIR/erpnext/ci_setup.py"

cleanup_ci_setup_module() {
	rm -f "$CI_SETUP_MODULE"
}

trap cleanup_ci_setup_module EXIT

cat > "$CI_SETUP_MODULE" <<'PYTHON'
import os
from datetime import date

import frappe
from frappe.desk.page.setup_wizard.setup_wizard import setup_complete


def complete():
    frappe.set_user("Administrator")
    frappe.local.lang = "en"

    if frappe.is_setup_complete():
        print("ERPNext Setup Wizard is already complete.")
        return "already-complete"

    current_year = date.today().year

    setup_arguments = {
        "language": "English",
        "email": "administrator@example.com",
        "full_name": "Administrator",
        "password": os.environ.get("ADMIN_PASSWORD", "admin"),
        "country": os.environ.get("COUNTRY", "Canada"),
        "timezone": os.environ.get("TIMEZONE", "America/Toronto"),
        "currency": os.environ.get("CURRENCY", "CAD"),
        "company_name": os.environ.get(
            "COMPANY_NAME",
            "Automation Company",
        ),
        "company_abbr": os.environ.get(
            "COMPANY_ABBR",
            "AC",
        ),
        "domain": "Services",
        "chart_of_accounts": "Standard",
        "fy_start_date": f"{current_year}-01-01",
        "fy_end_date": f"{current_year}-12-31",
        "setup_demo": 0,
        "enable_telemetry": 0,
    }

    setup_complete(setup_arguments)

    frappe.db.commit()
    frappe.clear_cache()

    if not frappe.is_setup_complete():
        raise RuntimeError(
            "Setup Wizard ran, but "
            "frappe.is_setup_complete() is still False."
        )

    print("ERPNext Setup Wizard completed successfully.")
    return "completed"
PYTHON

bench \
	--site "$SITE_NAME" \
	execute erpnext.ci_setup.complete

cleanup_ci_setup_module
trap - EXIT

bench \
	--site "$SITE_NAME" \
	set-config developer_mode 1

log "Running migrations"

bench \
	--site "$SITE_NAME" \
	migrate

log "Clearing cache"

bench \
	--site "$SITE_NAME" \
	clear-cache

bench \
	--site "$SITE_NAME" \
	clear-website-cache

log "Selecting default site"

bench use "$SITE_NAME"

log "ERPNext environment setup completed successfully"

echo "Site: $SITE_NAME"
echo "Administrator password: configured"
echo "Setup Wizard: completed"