import { expect, type Page, type Locator } from '@playwright/test'

export class BankPage {
  private readonly bankBtn: Locator
  private readonly addBankBtn: Locator
  private readonly modalText: Locator
  private readonly bankNameInput: Locator
  private readonly swiftNumInput: Locator
  private readonly newBankSaveBtn: Locator
  private readonly missingFieldValidation: Locator
  private readonly moreOptionsBtn: Locator
  private readonly deleteBankBtn: Locator
  private readonly deleteBankConfirmModal: Locator
  private readonly deleteBankConfirmBtn: Locator

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
    this.missingFieldValidation = page.locator('.modal-body .msgprint li')
    this.moreOptionsBtn = page.getByRole('button', {
      name: 'Menu',
      exact: true,
    })
    this.deleteBankBtn = page.locator(
      '.es-menu__label:visible:has-text("Delete")'
    )
    this.deleteBankConfirmModal = page.locator('.modal').filter({
      has: page.getByRole('heading', { name: 'Confirm', exact: true }),
    })
    this.deleteBankConfirmBtn =
      this.deleteBankConfirmModal.locator('.btn-modal-primary')
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
    if (swift !== undefined) {
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
  async assertModalTextValidation(text: string, text1: string) {
    await this.modalText.waitFor({ state: 'visible' })
    await expect(this.modalText.last()).toContainText(text, { timeout: 10000 })
    await expect(this.missingFieldValidation).toContainText(text1)
  }
  async clickSpecificBank(bankName: string) {
    const bankLocator = this.page.locator(
      `.level-item.bold [data-name="${bankName}"]`
    )
    await bankLocator.waitFor({ state: 'visible' })
    await bankLocator.click()
  }
  async clickMoreOptionsBtn() {
    await expect(this.moreOptionsBtn).toBeVisible()
    await this.moreOptionsBtn.click({ force: true })
  }
  async clickDeleteBankBtn() {
    await this.deleteBankBtn.waitFor({ state: 'visible' })
    await this.deleteBankBtn.click()
  }
  async clickDeleteBankConfirmBtn() {
    await expect(
      this.deleteBankConfirmModal.getByRole('heading', {
        name: 'Confirm',
        exact: true,
      })
    ).toBeVisible({ timeout: 10000 })
    await this.deleteBankConfirmBtn.click()
  }
}
