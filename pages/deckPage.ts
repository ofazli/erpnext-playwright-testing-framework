import { expect, Page } from '@playwright/test'

export class DeckPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  private get erpNextLogo() {
    return this.page.locator('[alt="ERPNext"]').first()
  }

  async clickErpNextLogo() {
    await this.erpNextLogo.waitFor({ state: 'visible' })
    await this.erpNextLogo.click()
  }
}
