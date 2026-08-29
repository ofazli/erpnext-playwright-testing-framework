import { expect, type Page, type Locator } from '@playwright/test'

export class PaymentsPage {
  private readonly bankingDropDown: Locator
  private readonly bankbtn: Locator

  constructor(private readonly page: Page) {
    this.bankingDropDown = page.locator('[data-id="Banking Setup"]')
    this.bankbtn = page.locator('[data-id="Bank"]')
  }

  async clickBankingDropDown() {
    await this.bankingDropDown.waitFor({ state: 'visible' })
    await this.bankingDropDown.click()
  }
  async clickBankBnt() {
    await this.bankbtn.waitFor({ state: 'visible' })
    await this.bankbtn.click()
  }
}
