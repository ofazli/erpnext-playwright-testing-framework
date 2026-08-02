import { test, expect } from '../../../fixtures/pages'
import { adminUser } from '../../../test-data/users'

test('Basic Login Test', async ({
  page,
  loginPage,
  deckPage,
  homePage,
  customerPage,
  newCustomerModalPage,
}) => {
  await loginPage.goToMainPage()
  await loginPage.assertWelcomeTextMessage('Welcome')
  await loginPage.basicLogin(adminUser)
  await deckPage.clickErpNextLogo()
  await homePage.assertErpNextTextMsg('ERPNext')
  await homePage.clickCustomerBtn()
  await customerPage.assertCustomerTxt('Customer')
  await customerPage.clickAddCustomerBtn()
  await page.pause()
})
