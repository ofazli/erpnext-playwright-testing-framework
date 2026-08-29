import { test as setup } from '@playwright/test'
import { LoginPage } from '../../pages/loginPage'
import { DeckPage } from '../../pages/deskPage'
import { adminUser } from '../../test-data/users'

const authFile = 'playwright/.auth/admin.json'

setup('authenticate as admin', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const deckPage = new DeckPage(page)

  await loginPage.goToMainPage()
  await loginPage.assertWelcomeTextMessage('Welcome')
  await loginPage.basicLogin(adminUser)
  await deckPage.clickErpNextLogo()

  await page.context().storageState({ path: authFile })
})
