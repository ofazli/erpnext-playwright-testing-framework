import { expect, type Page, type Locator } from '@playwright/test'

export class BankAccountTypePage {
  private readonly addBankAccountTypeBtn: Locator
  private readonly bankAccountTypeInput: Locator
  private readonly saveBtn: Locator
  private readonly commentsField: Locator
  private readonly commentBtn: Locator
  private readonly commentsFieldText: Locator
  private readonly errorMessage: Locator
  private readonly moreOptionsBtn: Locator
  private readonly deleteBankBtn: Locator
  private readonly deleteBankConfirmModal: Locator
  private readonly deleteBankConfirmBtn: Locator

  constructor(private readonly page: Page) {
    this.addBankAccountTypeBtn = page.locator(
      '[data-label="Add%20Bank%20Account%20Type"]'
    )
    this.bankAccountTypeInput = page
      .locator('[data-fieldname="account_type"]')
      .last()
    this.saveBtn = page.locator('button.es-button [data-label="Save"]').last()
    this.commentsField = page.locator('div .ql-editor')
    this.commentBtn = page.locator('button.btn-comment')
    this.commentsFieldText = page.locator('div.read-mode')
    this.errorMessage = page.locator('.msgprint')
    this.moreOptionsBtn = page.locator('.menu-more-button').last()
    this.deleteBankBtn = page.locator(
      '.es-menu__label:visible:has-text("Delete")'
    )
    this.deleteBankConfirmModal = page.locator('.modal').filter({
      has: page.getByRole('heading', { name: 'Confirm', exact: true }),
    })
    this.deleteBankConfirmBtn =
      this.deleteBankConfirmModal.locator('.btn-modal-primary')
  }

  async clickAddBankAccountTypeBtn() {
    await this.addBankAccountTypeBtn.waitFor({ state: 'visible' })
    await this.addBankAccountTypeBtn.click()
  }
  async fillBankAccountTypeInput(text: string) {
    await this.bankAccountTypeInput.waitFor({ state: 'visible' })
    await this.bankAccountTypeInput.fill(text)
  }
  async clickSaveBtn() {
    await this.saveBtn.waitFor({ state: 'visible' })
    await this.page.waitForTimeout(1500)
    await this.saveBtn.click()
  }
  async fillCommentsField(text: string) {
    await this.commentsField.waitFor({ state: 'visible' })
    await this.commentsField.fill(text)
  }
  async clickCommentBtn() {
    await this.commentBtn.waitFor({ state: 'visible' })
    await this.commentBtn.click()
  }
  async assertCommentsField(text: string) {
    await this.commentsFieldText.waitFor({ state: 'visible' })
    await expect(this.commentsFieldText).toContainText(text)
  }
  async assertErrorMessage(text: string) {
    await this.errorMessage.waitFor({ state: 'visible' })
    await expect(this.errorMessage).toContainText(text)
  }
  async clickMoreOptionsBtn() {
    await this.moreOptionsBtn.waitFor({ state: 'visible' })
    await this.moreOptionsBtn.click()
  }
  async clickDeleteBankBtn() {
    await this.deleteBankBtn.waitFor({ state: 'visible' })
    await this.deleteBankBtn.click()
  }
  async clickDeleteBankConfirmBtn() {
    await this.deleteBankConfirmBtn.waitFor({ state: 'visible' })
    await this.deleteBankConfirmBtn.click()
  }
  async assertDeleteBankAccountTypeSuccessfully(text: string) {
    await this.deleteBankConfirmModal.waitFor({ state: 'visible' })
    await expect(this.deleteBankConfirmModal).toContainText(text)
  }
}
