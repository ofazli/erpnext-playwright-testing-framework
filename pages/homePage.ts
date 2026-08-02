import { expect, Page } from '@playwright/test'

export class HomePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }
  private get erpNextTextMessage() {
    return this.page.locator('.header-title')
  }
  private get customerBtn() {
    return this.page.locator('[data-id="Customer"]')
  }

  async assertErpNextTextMsg(message: string) {
    await expect(this.erpNextTextMessage).toContainText(message)
  }
  async clickCustomerBtn() {
    await this.customerBtn.waitFor({ state: 'visible' })
    await this.customerBtn.click()
  }
}
