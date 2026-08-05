import { buildCustomer } from '../../../api/builders/customerBuilder'
import { CreateCustomerResponse } from '../../../api/models/customerResponse'
import { test, expect } from '../../../fixtures/api'

test.describe('Customer API', () => {
  test('Should create new customer successfully', async ({ customerApi }) => {
    const customerPayload = buildCustomer()

    const response = await customerApi.createCustomer(customerPayload)

    expect(response.status()).toBe(200)
    expect(response.ok()).toBeTruthy()

    const responseBody = (await response.json()) as CreateCustomerResponse

    expect(responseBody.message).toBeDefined()
    expect(responseBody.message.doctype).toBe('Customer')

    expect(responseBody.message.customer_name).toBe(
      customerPayload.doc.customer_name
    )

    expect(responseBody.message.customer_type).toBe(
      customerPayload.doc.customer_type
    )

    expect(responseBody.message.email_id).toBe(customerPayload.doc.email_id)

    expect(responseBody.message.mobile_no).toBe(customerPayload.doc.mobile_no)
  })
})
