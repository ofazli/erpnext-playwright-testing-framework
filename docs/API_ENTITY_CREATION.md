# ERPNext API Entity Creation Guide

This document explains how the test framework creates ERPNext entities through
the API. The current examples cover `Customer` and `Bank` records and use
Playwright's API request support with TypeScript.

## Overview

The API test flow is:

1. Create an authenticated Playwright API request context.
2. Log in to ERPNext with `POST /api/method/login`.
3. Obtain a CSRF token.
4. Build a typed request payload.
5. Send the payload through the entity-specific API client.
6. Validate the HTTP response and the returned entity data.

```text
Test
  -> Builder
  -> Entity API client
  -> ERPNextApiClient
  -> ERPNext endpoint
  -> Response validation
```

## Authentication and CSRF protection

API fixtures create a request context using `BASE_URL`, then authenticate with
the credentials supplied through environment variables:

```dotenv
BASE_URL=http://localhost:8000
ADMIN_USERNAME=Administrator
ADMIN_PASSWORD=admin
```

The login request is:

```http
POST /api/method/login
Content-Type: application/x-www-form-urlencoded

usr=Administrator&pwd=admin
```

After a successful login, the fixture retrieves a CSRF token from:

```http
GET /api/method/frappe.sessions.get_csrf_token
```

The token is sent with every JSON write request using the
`X-Frappe-CSRF-Token` header. The shared HTTP client also sets
`Content-Type: application/json`.

## Shared API client

`api/client/erpnextApiClient.ts` centralizes the HTTP behavior. It currently
supports `GET`, `POST`, `PUT`, and `DELETE` requests.

Entity-specific clients should use this shared client rather than calling
Playwright's request context directly. This keeps authentication headers and
request formatting consistent across API tests.

## Creating a Customer

### Endpoint

```http
POST /api/method/frappe.client.save
```

### Request payload

ERPNext expects the document inside a `doc` property:

```json
{
  "doc": {
    "doctype": "Customer",
    "customer_name": "Automation Company 1234567890",
    "customer_type": "Company",
    "customer_group": "Commercial",
    "territory": "All Territories",
    "email_id": "automation-1234567890@test.com",
    "mobile_no": "4164567890"
  }
}
```

The request contract is defined in `api/models/customerRequest.ts`:

- `doctype` is always `Customer`.
- `customer_name`, `customer_type`, `customer_group`, and `territory` are required.
- `email_id` and `mobile_no` are optional.
- `customer_type` accepts `Company`, `Individual`, or `Partnership`.

### Building a unique payload

Use `buildCustomer()` instead of reusing a fixed name in tests:

```ts
import { buildCustomer } from '../../../api/builders/customerBuilder'

const customerPayload = buildCustomer({
  customer_type: 'Company',
})
```

The builder uses a timestamp suffix to generate unique values for the customer
name, email address, and mobile number. Optional fields can be overridden while
the `doctype` remains fixed.

### Sending and validating the request

```ts
const response = await customerApi.createCustomer(customerPayload)

expect(response.status()).toBe(200)
expect(response.ok()).toBeTruthy()

const responseBody = (await response.json()) as CreateCustomerResponse

expect(responseBody.message.doctype).toBe('Customer')
expect(responseBody.message.customer_name).toBe(
  customerPayload.doc.customer_name,
)
```

The response document is available under `responseBody.message`.

## Creating a Bank

### Endpoint

```http
POST /api/method/frappe.client.save
```

### Request payload

```json
{
  "doc": {
    "doctype": "Bank",
    "bank_name": "Automation Bank 1234567890",
    "swift_number": "AUTOCA67890"
  }
}
```

The Bank request contract is defined in `api/models/bankRequest.ts`:

- `doctype` is always `Bank`.
- `bank_name` is required.
- `swift_number` is optional.

### Building and creating a bank

```ts
import { buildBank } from '../../../../api/builders/bankBuilder'

const bankPayload = buildBank()
const response = await bankApi.createBank(bankPayload)

expect(response.status()).toBe(200)
expect(response.ok()).toBeTruthy()

const responseBody = (await response.json()) as CreateBankResponse

expect(responseBody.message.doctype).toBe('Bank')
expect(responseBody.message.bank_name).toBe(bankPayload.doc.bank_name)
expect(responseBody.message.swift_number).toBe(bankPayload.doc.swift_number)
```

`buildBank()` creates unique `bank_name` and `swift_number` values and accepts
field overrides:

```ts
const bankPayload = buildBank({
  bank_name: 'Demo Bank',
  swift_number: 'DEMOCA12345',
})
```

## Deleting and verifying a Bank

The Bank API client uses the following endpoint for deletion:

```http
DELETE /api/method/frappe.client.delete
```

The delete payload contains the DocType and the ERPNext document name returned
by the create response:

```ts
const createResponse = await bankApi.createBank(buildBank())
const createBody = (await createResponse.json()) as CreateBankResponse
const bankName = createBody.message.name

const deleteResponse = await bankApi.deleteBank({
  doctype: 'Bank',
  name: bankName,
})

expect(deleteResponse.status()).toBe(200)
expect(deleteResponse.ok()).toBeTruthy()

const getResponse = await bankApi.getBank(bankName)
expect(getResponse.status()).toBe(404)
```

The GET request used for verification is:

```http
GET /api/resource/Bank/{encoded-bank-name}
```

The bank name is URL-encoded by `NewBankApi.getBank()` before it is added to
the endpoint.

## Creating a Bank Account Type

Bank Account Type uses ERPNext's form-save endpoint instead of the standard
`frappe.client.save` endpoint.

### Endpoint

```http
POST /api/method/frappe.desk.form.save.savedocs
```

### Request payload

```json
{
  "doc": {
    "docstatus": 0,
    "doctype": "Bank Account Type",
    "name": "new-bank-account-type-1234567890",
    "__islocal": 1,
    "account_type": "Checking1234567890"
  },
  "action": "Save"
}
```

Use `buildBankAccountType()` to generate unique `name` and `account_type`
values. The saved document is returned in the first element of the `docs`
array.

## Project structure

| Layer | Location | Responsibility |
| --- | --- | --- |
| API test | `tests/api/` | Executes the scenario and validates the result |
| Builder | `api/builders/` | Creates unique test payloads |
| Template | `api/templates/` | Stores default entity values |
| Request model | `api/models/*Request.ts` | Defines the request contract |
| Response model | `api/models/*Response.ts` | Defines the expected response shape |
| Entity API client | `api/client/customerApi.ts`, `api/client/newBankApi.ts`, `api/client/bankAccountTypeApi.ts` | Maps business actions to ERPNext endpoints |
| Shared HTTP client | `api/client/erpnextApiClient.ts` | Sends requests with JSON and CSRF headers |
| Fixture | `fixtures/api.ts` | Provides login, CSRF token, and API clients |

## Adding another ERPNext entity

To add an API flow for another DocType:

1. Add request and response interfaces under `api/models/`.
2. Add default values under `api/templates/`.
3. Add a builder under `api/builders/` and generate unique values where needed.
4. Add an entity API client under `api/client/`.
5. Register the client in `fixtures/api.ts`.
6. Add a test under `tests/api/`.
7. Validate both the HTTP status and the important fields in `message` or `docs`, depending on the ERPNext endpoint response.

For create operations, follow the same ERPNext document shape:

```json
{
  "doc": {
    "doctype": "Your DocType",
    "field_name": "value"
  }
}
```

Keep entity-specific endpoint paths in the entity API client and keep shared
headers and transport behavior in `ERPNextApiClient`.

## Running the API tests

Run all Playwright tests:

```bash
npx playwright test --project=chromium
```

Run a specific API test:

```bash
npx playwright test tests/api/Customer/createCustomer.spec.ts --project=chromium
npx playwright test tests/api/payments/bank/createABank.spec.ts --project=chromium
npx playwright test tests/api/payments/bank/deleteABank.spec.ts --project=chromium
```

Run TypeScript type checking:

```bash
npx tsc --noEmit
```
