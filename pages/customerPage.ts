import { expect, Page } from '@playwright/test'

export class CustomerPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }
  private get customerTextTitle() {
    return this.page.locator('[id="page-List/Customer/List"] .title-text')
  }
  private get addCustomerBtn() {
    return this.page.locator('[id="page-List/Customer/List"] .primary-action')
  }

  async assertCustomerTxt(message: string) {
    await this.customerTextTitle.waitFor({ state: 'visible' })
    await expect(this.customerTextTitle).toContainText(message)
  }
  async clickAddCustomerBtn() {
    await this.addCustomerBtn.waitFor({ state: 'visible' })
    await this.addCustomerBtn.click()
  }
}
