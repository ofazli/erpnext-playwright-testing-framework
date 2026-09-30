import { buildBankAccountType } from '../../../../../api/builders/bankAccountTypeBuilder'
import type { CreateBankAccountTypeResponse } from '../../../../../api/models/bankAccountTypeResponse'
import { test, expect } from '../../../../../fixtures/api'

test.describe('Bank Account Type API', () => {
  test('Should delete a bank account type successfully', async ({
    bankAccountTypeApi,
  }) => {
    const payload = buildBankAccountType()

    const createResponse =
      await bankAccountTypeApi.createBankAccountType(payload)

    expect(createResponse.status()).toBe(200)
    expect(createResponse.ok()).toBeTruthy()

    const createBody =
      (await createResponse.json()) as CreateBankAccountTypeResponse
    const createdAccountType = createBody.docs[0]

    expect(createdAccountType).toBeDefined()

    const deleteResponse = await bankAccountTypeApi.deleteBankAccountType({
      doctype: 'Bank Account Type',
      name: createdAccountType.name,
    })

    expect(deleteResponse.status()).toBe(200)
    expect(deleteResponse.ok()).toBeTruthy()
  })
})
