import { test, expect } from '@playwright/test'
import { LoginPage } from '../../../pages/loginPage'
import { DeckPage } from '../../../pages/deckPage'
import { adminUser } from '../../../test-data/users'
import { HomePage } from '../../../pages/homePage'

test('Basic Login Test', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const deckPage = new DeckPage(page)
  const homePage = new HomePage(page)
  await loginPage.goToMainPage()
  await loginPage.assertWelcomeTextMessage('Welcome')
  await loginPage.basicLogin(adminUser)
  await deckPage.clickErpNextLogo()
  await homePage.assertErpNextTextMsg('ERPNext')
})
