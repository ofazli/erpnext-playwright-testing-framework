import { buildBankAccountType } from '../../../../../api/builders/bankAccountTypeBuilder'
import type { CreateBankAccountTypeResponse } from '../../../../../api/models/bankAccountTypeResponse'
import { test, expect } from '../../../../../fixtures/api'

test.describe('Bank Account Type API', () => {
  test('Should create a new bank account type successfully', async ({
    bankAccountTypeApi,
  }) => {
    const bankAccountTypePayload = buildBankAccountType()

    const response = await bankAccountTypeApi.createBankAccountType(
      bankAccountTypePayload,
    )

    expect(response.status()).toBe(200)
    expect(response.ok()).toBeTruthy()

    const responseBody =
      (await response.json()) as CreateBankAccountTypeResponse
    const createdBankAccountType = responseBody.docs[0]

    expect(createdBankAccountType).toBeDefined()
    expect(createdBankAccountType.doctype).toBe('Bank Account Type')
    expect(createdBankAccountType.account_type).toBe(
      bankAccountTypePayload.doc.account_type,
    )
    expect(createdBankAccountType.docstatus).toBe(0)
  })
})
