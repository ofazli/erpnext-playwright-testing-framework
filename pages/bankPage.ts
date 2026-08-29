import { expect, type Page, type Locator } from '@playwright/test'

export class BankPage {
  private readonly bankBtn: Locator
  private readonly addBankBtn: Locator
  private readonly modalText: Locator
  private readonly bankNameInput: Locator
  private readonly swiftNumInput: Locator
  private readonly newBankSaveBtn: Locator

  constructor(private readonly page: Page) {
    this.bankBtn = page.locator('[data-id="Bank"]')
    this.addBankBtn = page.locator('[data-label="Add Bank"]')
    this.modalText = page.locator('.modal-title')
    this.bankNameInput = page
      .locator(
        'input.input-with-feedback[data-fieldname="bank_name"][data-doctype="Bank"]'
      )
      .last()
    this.swiftNumInput = page
      .locator(
        'input.input-with-feedback[data-fieldname="swift_number"][data-doctype="Bank"]'
      )
      .last()
    this.newBankSaveBtn = page
      .locator('button.es-button.btn-modal-primary')
      .last()
  }

  async clickBankBtn() {
    await this.bankBtn.waitFor({ state: 'visible' })
    await this.bankBtn.click()
  }
  async clickAddBankBtn() {
    await this.addBankBtn.waitFor({ state: 'visible' })
    await this.addBankBtn.click()
  }
  async assertModalText(text: string) {
    await this.modalText.waitFor({ state: 'visible' })
    await expect(this.modalText).toHaveText(text)
  }
  async fillBankNameSwiftNum(bankName: string, swift?: string) {
    await this.bankNameInput.fill(bankName)
    await expect(this.bankNameInput).toHaveValue(bankName)
    if (swift) {
      await this.swiftNumInput.fill(swift)
    }
  }
  async clickNewBankSaveBtn() {
    await this.newBankSaveBtn.waitFor({ state: 'visible' })
    await this.newBankSaveBtn.click()
  }
  async assertNewBankSuccessMsg(text: string) {
    await expect(this.page.getByText(text)).toBeVisible()
  }
}
