import { test, expect } from '../../../fixtures/pages'
import { adminUser } from '../../../test-data/users'
import { CustomerFactory } from '../../../factories/CustomerFactory'

test('+Add New Customer Test', async ({
  page,
  loginPage,
  deckPage,
  homePage,
  customerPage,
  newCustomerModalPage,
}) => {
  const newCustomer = CustomerFactory.create()
  await loginPage.goToMainPage()
  await loginPage.assertWelcomeTextMessage('Welcome')
  await loginPage.basicLogin(adminUser)
  await deckPage.clickErpNextLogo()
  await homePage.assertErpNextTextMsg('ERPNext')
  await homePage.clickCustomerBtn()
  await customerPage.assertCustomerTxt('Customer')
  await customerPage.clickAddCustomerBtn()
  await newCustomerModalPage.createCustomer(newCustomer)
  await newCustomerModalPage.asserCustomerCreated(newCustomer.customerName)
})
