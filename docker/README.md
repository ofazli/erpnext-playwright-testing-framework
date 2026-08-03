# Docker development environment

This setup runs Frappe, MariaDB 11.8, and Redis entirely in Docker. The current
ERPNext checkout is bind-mounted into the bench, so source changes are available
inside the running container immediately.

Start and bootstrap the environment:

```bash
docker compose -f compose.dev.yaml up -d
```

The first run downloads the images, creates the Frappe bench and site, installs
ERPNext, and builds assets. Open <http://erpnext.localhost:8000/app> and sign in
with `Administrator` / `admin`.

Useful commands:

```bash
docker compose -f compose.dev.yaml logs -f frappe
docker compose -f compose.dev.yaml exec frappe bash
docker compose -f compose.dev.yaml down
```

To choose different initial passwords, create a `.env` file before the first
run:

```dotenv
ADMIN_PASSWORD=change-me
DB_ROOT_PASSWORD=change-me-too
SITE_NAME=erpnext.localhost
```

`docker compose down` preserves the bench, database, and Redis volumes. To make
a completely fresh disposable environment, explicitly remove the Compose
volumes as well:

```bash
docker compose -f compose.dev.yaml down --volumes
```
