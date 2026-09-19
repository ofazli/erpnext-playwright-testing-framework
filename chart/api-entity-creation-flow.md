# ERPNext API Entity Creation Flow

This chart shows the shared API setup and the Customer and Bank entity flows
implemented in the Playwright test framework.

```mermaid
flowchart TD
    START(["API test starts"])
    ENV["Read environment variables<br/>BASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD"]
    CONTEXT["Create authenticated API request context"]
    LOGIN["POST /api/method/login"]
    LOGIN_OK{"Login successful?"}
    CSRF["Get CSRF token<br/>GET /api/method/frappe.sessions.get_csrf_token"]
    CLIENT["Create ERPNextApiClient<br/>JSON headers + CSRF header"]
    ENTITY{"Which entity?"}

    CUSTOMER_BUILDER["buildCustomer()<br/>Create unique Customer payload"]
    CUSTOMER_API["CustomerApi.createCustomer()"]
    CUSTOMER_SAVE["POST /api/method/frappe.client.save"]
    CUSTOMER_DOC["ERPNext Customer DocType<br/>Creates the customer"]
    CUSTOMER_VALIDATE["Validate 200 response<br/>doctype, name, email, mobile"]
    CUSTOMER_SUCCESS(["Customer test passes"])

    BANK_BUILDER["buildBank()<br/>Create unique Bank payload"]
    BANK_API["NewBankApi.createBank()"]
    BANK_SAVE["POST /api/method/frappe.client.save"]
    BANK_DOC["ERPNext Bank DocType<br/>Creates the bank"]
    BANK_VALIDATE["Validate 200 response<br/>doctype, bank name, SWIFT number"]
    BANK_ACTION{"Delete bank too?"}
    BANK_SUCCESS(["Bank creation test passes"])

    ACCOUNT_TYPE_BUILDER["buildBankAccountType()<br/>Create unique Bank Account Type payload"]
    ACCOUNT_TYPE_API["BankAccountTypeApi.createBankAccountType()"]
    ACCOUNT_TYPE_SAVE["POST /api/method/frappe.desk.form.save.savedocs"]
    ACCOUNT_TYPE_DOC["ERPNext Bank Account Type DocType<br/>Creates the account type"]
    ACCOUNT_TYPE_VALIDATE["Validate 200 response<br/>docs[0], doctype, account type"]
    ACCOUNT_TYPE_SUCCESS(["Bank Account Type test passes"])

    DELETE_API["NewBankApi.deleteBank()"]
    DELETE["DELETE /api/method/frappe.client.delete"]
    GET_API["NewBankApi.getBank()"]
    GET["GET /api/resource/Bank/{encoded-name}"]
    DELETE_VALIDATE["Validate 200 delete response<br/>and 404 GET response"]
    DELETE_SUCCESS(["Bank lifecycle test passes"])

    FAILURE(["Test fails"])
    END(["API test ends"])

    START --> ENV --> CONTEXT --> LOGIN --> LOGIN_OK
    LOGIN_OK -->|"No"| FAILURE
    LOGIN_OK -->|"Yes"| CSRF --> CLIENT --> ENTITY

    ENTITY -->|"Customer"| CUSTOMER_BUILDER --> CUSTOMER_API --> CUSTOMER_SAVE --> CUSTOMER_DOC --> CUSTOMER_VALIDATE
    CUSTOMER_VALIDATE -->|"Valid"| CUSTOMER_SUCCESS --> END
    CUSTOMER_VALIDATE -->|"Invalid"| FAILURE

    ENTITY -->|"Bank"| BANK_BUILDER --> BANK_API --> BANK_SAVE --> BANK_DOC --> BANK_VALIDATE
    BANK_VALIDATE -->|"Invalid"| FAILURE
    BANK_VALIDATE -->|"Valid"| BANK_ACTION
    BANK_ACTION -->|"No"| BANK_SUCCESS --> END
    BANK_ACTION -->|"Yes"| DELETE_API --> DELETE --> GET_API --> GET --> DELETE_VALIDATE
    DELETE_VALIDATE -->|"Valid"| DELETE_SUCCESS --> END
    DELETE_VALIDATE -->|"Invalid"| FAILURE

    ENTITY -->|"Bank Account Type"| ACCOUNT_TYPE_BUILDER --> ACCOUNT_TYPE_API --> ACCOUNT_TYPE_SAVE --> ACCOUNT_TYPE_DOC --> ACCOUNT_TYPE_VALIDATE
    ACCOUNT_TYPE_VALIDATE -->|"Valid"| ACCOUNT_TYPE_SUCCESS --> END
    ACCOUNT_TYPE_VALIDATE -->|"Invalid"| FAILURE

    FAILURE --> END
```

## Payload shape

Customer and Bank create operations use the following ERPNext document wrapper:

```json
{
  "doc": {
    "doctype": "Customer or Bank",
    "field_name": "value"
  }
}
```

Bank Account Type additionally sends the `action: "Save"` property and uses
the `frappe.desk.form.save.savedocs` endpoint.

## Main components

| Flow stage | Implementation |
| --- | --- |
| Authentication | `fixtures/api.ts` |
| CSRF token retrieval | `api/utils/csrfToken.ts` |
| Shared HTTP transport | `api/client/erpnextApiClient.ts` |
| Customer creation | `api/client/customerApi.ts` |
| Bank creation and deletion | `api/client/newBankApi.ts` |
| Bank Account Type creation | `api/client/bankAccountTypeApi.ts` |
| Customer payload builder | `api/builders/customerBuilder.ts` |
| Bank payload builder | `api/builders/bankBuilder.ts` |
| Customer test | `tests/api/Customer/createCustomer.spec.ts` |
| Bank create test | `tests/api/payments/bank/createABank.spec.ts` |
| Bank delete test | `tests/api/payments/bank/deleteABank.spec.ts` |
| Bank Account Type test | `tests/api/payments/bank/BankAccountType/createBankAccountType.spec.ts` |
