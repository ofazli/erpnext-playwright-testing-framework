import { expect, type Page, type Locator } from '@playwright/test'

export class PaymentsPage {
  private readonly bankingDropDown: Locator
  private readonly bankbtn: Locator
  private readonly bankAccountTypeBtn: Locator

  constructor(private readonly page: Page) {
    this.bankingDropDown = page.locator('[data-id="Banking Setup"]')
    this.bankbtn = page.locator('[data-id="Bank"]')
    this.bankAccountTypeBtn = page.locator('[data-id="Bank Account Type"]')
  }

  async clickBankingDropDown() {
    await this.bankingDropDown.waitFor({ state: 'visible' })
    await this.bankingDropDown.click()
  }
  async clickBankBnt() {
    await this.bankbtn.waitFor({ state: 'visible' })
    await this.bankbtn.click()
  }
  async clickBankAccountTypeBtn() {
    await this.bankAccountTypeBtn.waitFor({ state: 'visible' })
    await this.bankAccountTypeBtn.click()
  }
}
