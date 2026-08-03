# Docker development environment

This setup runs Frappe, MariaDB 11.8, and Redis entirely in Docker. The current
ERPNext checkout is bind-mounted into the bench, so source changes are available
inside the running container immediately.

The Compose file pins every Docker image to an immutable multi-platform manifest
digest. GitHub Actions uses the AMD64 variant and Apple Silicon machines use the
ARM64 variant, but both variants come from the same image release. This avoids a
cached local tag such as `frappe/bench:latest` differing from the tag fetched by
a fresh GitHub Actions runner.

Start and bootstrap the environment:

```bash
docker compose -f compose.dev.yaml up -d
```

After an image digest is updated in `compose.dev.yaml`, refresh local containers:

```bash
docker compose -f compose.dev.yaml pull
docker compose -f compose.dev.yaml up -d --force-recreate
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
