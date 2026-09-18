import { test, expect } from '../../../../fixtures/pages'
import { buildBank } from '../../../../api/builders/bankBuilder'

test.describe('Payments - Bank Account Type', () => {
  test.describe.configure({ mode: 'default' })

  test.beforeEach(async ({ loginPage, deckPage }) => {
    await loginPage.goToMainPage()
    await deckPage.clickErpNextLogo()
  })
  const accountType = `Checking`
  const comment = `This is a test comment`

  test('Should Create Bank Account Type Successfully', async ({
    deckPage,
    paymentsPage,
    bankPage,
    bankApi,
    bankAccountTypePage,
  }) => {
    const bankPayload = buildBank()

    const response = await bankApi.createBank(bankPayload)
    expect(response.status()).toBe(200)

    await deckPage.clickPaymentsBtn()
    await paymentsPage.clickBankingDropDown()
    await paymentsPage.clickBankBnt()
    await bankPage.clickBankBtn()
    await bankPage.assertNewBankCreatedSuccessfully(
      `${bankPayload.doc.bank_name}`
    )
    await paymentsPage.clickBankAccountTypeBtn()
    await bankAccountTypePage.clickAddBankAccountTypeBtn()
    await bankAccountTypePage.fillBankAccountTypeInput(
      `${Date.now()} ${accountType}`
    )
    await bankAccountTypePage.clickSaveBtn()
    await bankAccountTypePage.fillCommentsField(comment)
    await bankAccountTypePage.clickCommentBtn()
    await bankAccountTypePage.assertCommentsField(comment)
  })
  test('Should Not Create Bank Account Type Without Name', async ({
    deckPage,
    paymentsPage,
    bankPage,
    bankApi,
    bankAccountTypePage,
  }) => {
    const bankPayload = buildBank()

    const response = await bankApi.createBank(bankPayload)
    expect(response.status()).toBe(200)

    await deckPage.clickPaymentsBtn()
    await paymentsPage.clickBankingDropDown()
    await paymentsPage.clickBankBnt()
    await bankPage.clickBankBtn()
    await bankPage.assertNewBankCreatedSuccessfully(
      `${bankPayload.doc.bank_name}`
    )
    await paymentsPage.clickBankAccountTypeBtn()
    await bankAccountTypePage.clickAddBankAccountTypeBtn()
    await bankAccountTypePage.clickSaveBtn()
    await bankAccountTypePage.assertErrorMessage('Account Type is required')
  })
  test('Should Delete Bank Account Type Successfull', async ({
    deckPage,
    paymentsPage,
    bankPage,
    bankApi,
    bankAccountTypePage,
  }) => {
    const bankPayload = buildBank()

    const response = await bankApi.createBank(bankPayload)
    expect(response.status()).toBe(200)

    await deckPage.clickPaymentsBtn()
    await paymentsPage.clickBankingDropDown()
    await paymentsPage.clickBankBnt()
    await bankPage.clickBankBtn()
    await bankPage.assertNewBankCreatedSuccessfully(
      `${bankPayload.doc.bank_name}`
    )
    await paymentsPage.clickBankAccountTypeBtn()
    await bankAccountTypePage.clickAddBankAccountTypeBtn()
    await bankAccountTypePage.fillBankAccountTypeInput(
      `${Date.now()} ${accountType}`
    )
    await bankAccountTypePage.clickSaveBtn()
    await bankAccountTypePage.clickMoreOptionsBtn()
    await bankAccountTypePage.clickDeleteBankBtn()
    await bankAccountTypePage.clickDeleteBankConfirmBtn()
  })
})
