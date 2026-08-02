import type { Locator, Page } from '@playwright/test'

import type { Customer } from '../models/Customer'

export class CustomerPage {
  private readonly customerNameInput: Locator
  private readonly customerTypeDropdown: Locator
  private readonly firstNameInput: Locator
  private readonly lastNameInput: Locator
  private readonly territoryDropdown: Locator
  private readonly saveButton: Locator

  constructor(private readonly page: Page) {
    this.customerNameInput = page
      .locator(
        '[data-fieldname="__section_1"] .input-with-feedback[data-fieldname="customer_name"]'
      )
      .last()

    this.customerTypeDropdown = page
      .locator('.modal-content [data-fieldname="customer_type"]')
      .last()

    this.firstNameInput = page
      .locator('.modal-content [data-fieldname="map_to_first_name"]')
      .last()

    this.lastNameInput = page
      .locator('.modal-content [data-fieldname="map_to_last_name"]')
      .last()

    this.territoryDropdown = page.getByLabel('Territory')

    this.saveButton = page.getByRole('button', { name: 'Save' })
  }
}
