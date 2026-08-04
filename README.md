# ERPNext Playwright Testing Framework

End-to-end UI and API testing framework for ERPNext, built with Playwright and
TypeScript. The repository includes a reproducible Docker Compose environment
that bootstraps Frappe, ERPNext, MariaDB, and Redis locally and in GitHub
Actions.

The same Compose file is used in both environments. Docker images are pinned to
immutable multi-platform manifests, while Frappe and ERPNext are pinned to
specific Git revisions. This prevents a fresh GitHub runner and a developer's
cached local environment from silently using different application versions.

## What is included

- Playwright UI tests for login and Customer creation
- A Playwright API test for ERPNext authentication
- Page Object Model classes for reusable UI interactions
- Custom Playwright fixtures for page objects
- Typed test models, factories, and default test data
- A Docker Compose development environment
- Automated Frappe and ERPNext installation and site bootstrap
- A GitHub Actions workflow that creates a clean ERPNext environment, runs the
  test suite, and uploads diagnostic artifacts

## Architecture

```text
Playwright tests on the host or GitHub runner
                    |
                    v
             http://localhost:8000
                    |
                    v
              Frappe / ERPNext
               |           |
               v           v
           MariaDB     Redis cache/queue
```

Docker Compose runs the following services:

| Service | Purpose |
| --- | --- |
| `mariadb` | Stores the ERPNext site database. |
| `redis-cache` | Provides Frappe's cache backend. |
| `redis-queue` | Provides queue and Socket.IO Redis services. |
| `setup` | Creates the bench and site, installs dependencies, builds assets, and runs migrations. It exits successfully after bootstrap. |
| `frappe` | Runs the Frappe development processes and exposes ports `8000` and `9000`. |

Named Docker volumes preserve the bench, database, Redis data, and Node.js
dependencies between local runs. The ERPNext source repository is bind-mounted
from `../erpnext`.

## Prerequisites

Install the following tools before starting:

- Git
- Docker Desktop or Docker Engine with Docker Compose v2
- Node.js 22
- npm

The Playwright browser is installed separately during setup.

## Required directory layout

The testing framework and ERPNext repositories must be sibling directories
because `compose.dev.yaml` mounts ERPNext from `../erpnext`:

```text
parent-directory/
├── erpnext/
└── erpnext-playwright-testing-framework/
```

## Local setup

### 1. Clone the testing framework

```bash
git clone https://github.com/ofazli/erpnext-playwright-testing-framework.git
cd erpnext-playwright-testing-framework
```

### 2. Fetch the pinned ERPNext revision

From the testing framework directory, create the sibling ERPNext checkout used
by Docker Compose:

```bash
mkdir -p ../erpnext
git -C ../erpnext init
git -C ../erpnext remote add origin https://github.com/frappe/erpnext.git
git -C ../erpnext fetch --depth 1 origin 07ac4d83ef097c83e18b246dac5196d6c7b0656b
git -C ../erpnext checkout --detach FETCH_HEAD
```

Confirm the revision:

```bash
git -C ../erpnext rev-parse HEAD
```

Expected output:

```text
07ac4d83ef097c83e18b246dac5196d6c7b0656b
```

### 3. Configure the test environment

Create a `.env` file in the testing framework root:

```dotenv
BASE_URL=http://localhost:8000
ADMIN_USERNAME=Administrator
ADMIN_PASSWORD=admin
DB_ROOT_PASSWORD=123
SITE_NAME=erpnext.localhost
```

The `.env` file is ignored by Git. These credentials are intended only for the
disposable local test environment; do not reuse them in production.

Changing initial passwords after the site has already been created does not
update the existing database automatically. Create a fresh environment if you
need to bootstrap the site with different credentials.

### 4. Install the testing framework dependencies

```bash
npm ci
npx playwright install chromium
```

On a Linux machine that also needs browser system dependencies, run:

```bash
npx playwright install --with-deps chromium
```

### 5. Start ERPNext

```bash
docker compose -f compose.dev.yaml up -d
```

The first bootstrap takes longer because it performs all of the following:

1. Waits for MariaDB and Redis to become healthy.
2. Creates a Frappe bench using Python 3.14.
3. Checks out the pinned Frappe revision.
4. Installs Frappe and ERPNext Python dependencies in editable mode.
5. Installs Frappe, ERPNext, and Banking Node.js dependencies.
6. Builds Frappe and ERPNext JavaScript and CSS assets.
7. Verifies the required ERPNext browser bundles.
8. Creates the ERPNext site and installs the ERPNext application.
9. Completes the Setup Wizard with deterministic test-company defaults.
10. Runs migrations, clears caches, and selects the default site.

The pinned application revisions are:

| Application | Revision |
| --- | --- |
| Frappe | `38a7a98e2297bd74259adaf356bff6698291ff81` |
| ERPNext | `07ac4d83ef097c83e18b246dac5196d6c7b0656b` |

Follow the setup logs if the first run is still in progress:

```bash
docker compose -f compose.dev.yaml logs -f setup
```

Inspect container status:

```bash
docker compose -f compose.dev.yaml ps -a
```

When the `frappe` service is healthy, open one of these URLs:

- <http://localhost:8000/app>
- <http://erpnext.localhost:8000/app>

Sign in with `Administrator` and the configured `ADMIN_PASSWORD`.

## Running tests

Run the complete Chromium test suite:

```bash
npx playwright test --project=chromium
```

GitHub Actions uses one worker for deterministic execution. Use the same setting
when reproducing a CI result locally:

```bash
npx playwright test --project=chromium --workers=1
```

Run only the Customer test:

```bash
npx playwright test tests/ui/Customer/addNewCustomer.spec.ts --project=chromium
```

Run tests in Playwright UI mode:

```bash
npx playwright test --ui
```

Open the latest HTML report:

```bash
npx playwright show-report
```

Type-check the project without emitting JavaScript:

```bash
npx tsc --noEmit
```

Playwright is configured to retain traces and videos for failed tests and to
capture screenshots on failure. Local output is written to `test-results/` and
`playwright-report/`; both directories are ignored by Git.

## Test design

### Page Object Model

UI selectors and user actions live under `pages/`. Tests use these classes
instead of duplicating selectors:

- `LoginPage` handles navigation and authentication.
- `DeckPage` opens the ERPNext application from the app deck.
- `HomePage` navigates to the Customer workspace.
- `CustomerPage` opens the new Customer dialog.
- `NewCustomerModalPage` fills and submits Customer quick entry.

### Fixtures

`fixtures/pages.ts` extends Playwright's base test and injects page objects into
tests. A test can request only the page objects it needs:

```ts
import { test, expect } from '../../../fixtures/pages'

test('example', async ({ loginPage, homePage }) => {
  // Test steps
})
```

### Models, factories, and test data

- `models/` contains TypeScript interfaces used by tests.
- `test-data/` contains reusable defaults and environment-backed users.
- `factories/` creates unique records to prevent name collisions between runs.

`CustomerFactory`, for example, appends a timestamp to the Customer name and
email address.

### Current coverage

| Area | Type | Scenario |
| --- | --- | --- |
| Authentication | API | Administrator can log in through `/api/method/login`. |
| Authentication | UI | Administrator can sign in and open ERPNext. |
| Customer | UI | Administrator can create a Company customer with primary contact and address information. |

## Docker operations

View application logs:

```bash
docker compose -f compose.dev.yaml logs -f frappe
```

Open a shell inside the Frappe container:

```bash
docker compose -f compose.dev.yaml exec frappe bash
```

Stop containers while preserving all named volumes:

```bash
docker compose -f compose.dev.yaml down
```

Pull the pinned images and recreate containers without deleting data:

```bash
docker compose -f compose.dev.yaml pull
docker compose -f compose.dev.yaml up -d --force-recreate
```

Create a completely fresh environment:

```bash
docker compose -f compose.dev.yaml down --volumes --remove-orphans
docker compose -f compose.dev.yaml up -d
```

The first command permanently deletes this Compose project's local database,
bench, Redis, and Node.js dependency volumes. Use it only when existing local
test data is no longer needed.

## Reproducibility

`compose.dev.yaml` pins Frappe Bench, MariaDB, and Redis to immutable OCI
manifest-list digests. A GitHub runner selects the Linux AMD64 child image,
while an Apple Silicon machine selects the Linux ARM64 child image from the same
release. Their platform-specific image IDs are expected to differ.

Application code is pinned separately:

- The workflow fetches the exact ERPNext commit before starting Compose.
- `docker/setup.sh` fetches and checks out the exact Frappe commit.
- The setup script logs both installed revisions.
- Browser assets are built explicitly for `frappe,erpnext` and validated before
  tests start.

Local and CI application code and image releases are therefore aligned. Local
named volumes may still contain data from previous runs, whereas GitHub Actions
always removes its volumes at the end of a job. Use a fresh local environment
when database-level parity is required.

## GitHub Actions

The workflow is defined in `.github/workflows/erpnext-tests.yml`. It runs:

- For pull requests targeting `main`
- Manually through **Actions > ERPNext Playwright Tests > Run workflow**

The job performs these steps:

1. Checks out this testing framework.
2. Fetches the pinned ERPNext commit into the required sibling directory.
3. Validates the Docker Compose configuration.
4. Starts the Docker environment and prints setup logs if bootstrap fails.
5. Waits for the ERPNext ping endpoint to become healthy.
6. Verifies that the hashed ERPNext JavaScript bundle exists.
7. Prints the installed Frappe and ERPNext revisions.
8. Installs Node.js 22 dependencies with `npm ci`.
9. Installs Chromium and its Linux system dependencies.
10. Runs the Playwright suite against `http://localhost:8000` with one worker.
11. Prints recent Docker logs if the job fails.
12. Uploads Playwright reports and test results.
13. Removes containers and volumes, even if an earlier step failed.

The workflow uses the credentials of its disposable ERPNext site:

```text
ADMIN_USERNAME=Administrator
ADMIN_PASSWORD=admin
```

No repository secret is required for this isolated test environment.

### CI artifacts

The following artifacts are uploaded for every run and retained for 14 days:

| Artifact | Contents |
| --- | --- |
| `playwright-report` | Playwright HTML report. |
| `test-results` | Failure screenshots, videos, traces, and error context. |

Download the artifacts from the workflow run summary. A downloaded trace can be
opened with:

```bash
npx playwright show-trace path/to/trace.zip
```

## Project structure

```text
.
├── .github/workflows/
│   └── erpnext-tests.yml       # GitHub Actions pipeline
├── docker/
│   ├── README.md               # Docker-specific notes
│   └── setup.sh                # Frappe and ERPNext bootstrap
├── factories/                  # Typed test-data factories
├── fixtures/                   # Custom Playwright fixtures
├── models/                     # TypeScript domain models
├── pages/                      # Page Object Model classes
├── test-cases/                 # Manual/reference test-case documents
├── test-data/                  # Reusable defaults and users
├── tests/
│   ├── api/                    # API tests
│   └── ui/                     # Browser tests
├── compose.dev.yaml            # Local and CI Docker environment
├── playwright.config.ts        # Playwright configuration
├── package-lock.json           # Reproducible npm dependency lock
├── package.json
└── tsconfig.json
```

## Troubleshooting

### `../erpnext` does not exist

Compose requires the ERPNext repository to be next to this repository. Follow
the exact fetch commands in the local setup section and verify:

```bash
git -C ../erpnext rev-parse HEAD
```

### The setup container exits with an error

Inspect its logs and all container states:

```bash
docker compose -f compose.dev.yaml ps -a
docker compose -f compose.dev.yaml logs --no-color setup
```

After correcting the problem, recreate the services:

```bash
docker compose -f compose.dev.yaml up -d --force-recreate
```

### The Customer dialog shows only Customer Name and Customer Type

That is Frappe's generic quick-entry fallback and normally means the ERPNext
browser bundle was not loaded. Check the setup logs for asset build failures and
verify the manifest inside the container:

```bash
docker compose -f compose.dev.yaml exec -T frappe \
  grep -F 'erpnext.bundle.js' sites/assets/assets.json
```

The setup script makes ERPNext's generated `public` and `www` targets writable,
builds both Frappe and ERPNext assets, and fails immediately if the required JS
or CSS bundles are missing.

### Local behavior differs from GitHub Actions

First recreate containers from the pinned image references:

```bash
docker compose -f compose.dev.yaml pull
docker compose -f compose.dev.yaml up -d --force-recreate
```

Then compare revisions:

```bash
git -C ../erpnext rev-parse HEAD
docker compose -f compose.dev.yaml exec -T frappe \
  git -C /workspace/frappe-bench/apps/frappe rev-parse HEAD
```

If behavior still differs, reset the local volumes and bootstrap a fresh site.
Remember that `down --volumes` deletes all local data for this Compose project.

### Ports `8000` or `9000` are already in use

Stop the process or Compose project currently using those ports, then start this
environment again:

```bash
docker compose -f compose.dev.yaml down
docker compose -f compose.dev.yaml up -d
```

### A test passes alone but fails during local parallel execution

Run with the same worker count as CI:

```bash
npx playwright test --project=chromium --workers=1
```

Tests that share the same ERPNext Administrator and database can interfere with
one another when they execute concurrently.

## Contributing

Before opening a pull request:

```bash
npx tsc --noEmit
npx playwright test --project=chromium --workers=1
docker compose -f compose.dev.yaml config --quiet
```

Pull requests targeting `main` automatically run the complete GitHub Actions
workflow.

## License

This project is licensed under the ISC License as declared in `package.json`.
