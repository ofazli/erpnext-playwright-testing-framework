import { test, expect } from '../../../fixtures/pages'
import { CustomerFactory } from '../../../factories/CustomerFactory'

test('+Add New Customer Test', async ({
  loginPage,
  homePage,
  customerPage,
  newCustomerModalPage,
}) => {
  const newCustomer = CustomerFactory.create()
  await loginPage.goToMainPage()
  await homePage.assertErpNextTextMsg('ERPNext')
  await homePage.clickCustomerBtn()
  await customerPage.assertCustomerTxt('Customer')
  await customerPage.clickAddCustomerBtn()
  await newCustomerModalPage.createCustomer(newCustomer)
  await newCustomerModalPage.asserCustomerCreated(newCustomer.customerName)
})
