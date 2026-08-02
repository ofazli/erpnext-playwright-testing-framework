import { expect, Page } from '@playwright/test'
import { User } from '../test-data/users'

export class LoginPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  private get welcomeTextMessage() {
    return this.page.locator('.page-card-subtitle').nth(0)
  }
  private get usernNameInput() {
    return this.page.locator('#login_email').first()
  }
  private get passwordInput() {
    return this.page.locator('#login_password').first()
  }
  private get continueBtn() {
    return this.page.locator('[type="submit"]').first()
  }
  async assertWelcomeTextMessage(message: string) {
    await expect(this.welcomeTextMessage).toContainText(message)
  }
  async basicLogin(user: User) {
    await this.usernNameInput.fill(user.username)
    await this.passwordInput.fill(user.password)
    await this.continueBtn.waitFor({ state: 'visible' })
    await this.continueBtn.click()
  }

  async goToMainPage() {
    await this.page.goto(process.env.BASE_URL + '/')
  }
}
