import { test } from '../../../../fixtures/pages'
const addBankModalTxt = 'New Bank'
test.describe('Payments - Banking Setup', () => {
  // These tests share the same ERPNext Administrator session. Running them in
  // parallel can deadlock Frappe's tabUser session metadata update.
  test.describe.configure({ mode: 'default' })

  test.beforeEach(async ({ loginPage, deckPage }) => {
    await loginPage.goToMainPage()
    await deckPage.clickErpNextLogo()
  })
  test('Should Create New Bank With Bank Name And Swift Number', async ({
    deckPage,
    paymentsPage,
    bankPage,
  }) => {
    const bankName = `${Date.now()} TD Canada Trust`
    const swiftNumber = `${Date.now()} TDOMCATTTOR`
    await deckPage.clickPaymentsBtn()
    await paymentsPage.clickBankingDropDown()
    await paymentsPage.clickBankBnt()
    await bankPage.clickBankBtn()
    await bankPage.clickAddBankBtn()
    await bankPage.assertModalText(addBankModalTxt)
    await bankPage.fillBankNameSwiftNum(bankName, swiftNumber)
    await bankPage.clickNewBankSaveBtn()
    await bankPage.assertNewBankSuccessMsg(`${bankName} saved`)
  })
  test('Should create a bank with only bank name', async ({
    deckPage,
    paymentsPage,
    bankPage,
  }) => {
    const bankName = `${Date.now()} TD Canada Trust`
    await deckPage.clickPaymentsBtn()
    await paymentsPage.clickBankingDropDown()
    await paymentsPage.clickBankBnt()
    await bankPage.clickBankBtn()
    await bankPage.clickAddBankBtn()
    await bankPage.assertModalText(addBankModalTxt)
    await bankPage.fillBankNameSwiftNum(bankName)
    await bankPage.clickNewBankSaveBtn()
    await bankPage.assertNewBankSuccessMsg(`${bankName} saved`)
  })
  test('Should show validation when bank name is empty', async ({
    deckPage,
    paymentsPage,
    bankPage,
  }) => {
    await deckPage.clickPaymentsBtn()
    await paymentsPage.clickBankingDropDown()
    await paymentsPage.clickBankBnt()
    await bankPage.clickBankBtn()
    await bankPage.clickAddBankBtn()
    await bankPage.clickNewBankSaveBtn()
    await bankPage.assertModalTextValidation(
      'Missing Values Required',
      'Bank Name'
    )
  })
  test('Should delete an existing bank', async ({
    deckPage,
    paymentsPage,
    bankPage,
  }) => {
    const bankName = `${Date.now()} TD Canada Trust`
    await deckPage.clickPaymentsBtn()
    await paymentsPage.clickBankingDropDown()
    await paymentsPage.clickBankBnt()
    await bankPage.clickBankBtn()
    await bankPage.clickAddBankBtn()
    await bankPage.fillBankNameSwiftNum(bankName)
    await bankPage.clickNewBankSaveBtn()
    await bankPage.assertNewBankSuccessMsg(`${bankName} saved`)
    await bankPage.clickSpecificBank(bankName)
    await bankPage.clickMoreOptionsBtn()
    await bankPage.clickDeleteBankBtn()
    await bankPage.clickDeleteBankConfirmBtn()
  })
})
