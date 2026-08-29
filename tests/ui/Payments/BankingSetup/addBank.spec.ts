import { test } from '../../../../fixtures/pages'
const addBankModalTxt = 'New Bank'
test.describe('Payments - Banking Setup', () => {
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
})
