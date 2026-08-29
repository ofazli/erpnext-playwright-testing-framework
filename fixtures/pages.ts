import { test as base } from '@playwright/test'
import { LoginPage } from '../pages/loginPage'
import { DeckPage } from '../pages/deskPage'
import { HomePage } from '../pages/homePage'
import { CustomerPage } from '../pages/customerPage'
import { NewCustomerModalPage } from '../pages/newCustomerModalPage'
import { PaymentsPage } from '../pages/paymentsPage'
import { BankPage } from '../pages/bankPage'

export const test = base.extend<{
  loginPage: LoginPage
  deckPage: DeckPage
  homePage: HomePage
  customerPage: CustomerPage
  newCustomerModalPage: NewCustomerModalPage
  paymentsPage: PaymentsPage
  bankPage: BankPage
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },
  deckPage: async ({ page }, use) => {
    await use(new DeckPage(page))
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },
  customerPage: async ({ page }, use) => {
    await use(new CustomerPage(page))
  },
  newCustomerModalPage: async ({ page }, use) => {
    await use(new NewCustomerModalPage(page))
  },
  paymentsPage: async ({ page }, use) => {
    await use(new PaymentsPage(page))
  },
  bankPage: async ({ page }, use) => {
    await use(new BankPage(page))
  },
})

export { expect } from '@playwright/test'
