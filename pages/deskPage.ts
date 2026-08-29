import { expect, type Page, type Locator } from '@playwright/test'

export class DeckPage {
  private readonly erpNextLogo: Locator
  private readonly paymentsBtn: Locator

  constructor(private readonly page: Page) {
    this.erpNextLogo = page.locator('[alt="ERPNext"]').first()
    this.paymentsBtn = page.locator('[data-original-title="Payments"]')
  }

  async clickErpNextLogo() {
    await this.erpNextLogo.waitFor({ state: 'visible' })
    await this.erpNextLogo.click()
  }
  async clickPaymentsBtn() {
    await this.erpNextLogo.waitFor({ state: 'visible' })
    await this.paymentsBtn.click()
  }
}
