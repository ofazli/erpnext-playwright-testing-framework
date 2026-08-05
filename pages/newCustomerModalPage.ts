import { expect, type Locator, type Page } from '@playwright/test'

import type { Customer } from '../models/Customer'

export class NewCustomerModalPage {
  private readonly customerNameInput: Locator
  private readonly customerTypeDropdown: Locator
  private readonly firstNameInput: Locator
  private readonly lastNameInput: Locator
  private readonly mobileNumberInput: Locator
  private readonly addressLine1Input: Locator
  private readonly addressLine2Input: Locator
  private readonly stateInput: Locator
  private readonly cityInput: Locator
  private readonly countryInput: Locator
  private readonly zipCodeInput: Locator
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

    this.mobileNumberInput = page
      .locator('.modal-content [data-fieldname="mobile_number"]')
      .last()

    this.addressLine1Input = page
      .locator('.modal-content [data-fieldname="address_line1"]')
      .last()
    this.addressLine2Input = page
      .locator('.modal-content [data-fieldname="address_line2"]')
      .last()
    this.zipCodeInput = page
      .locator('.modal-content [data-fieldname="pincode"]')
      .last()
    this.cityInput = page
      .locator('.modal-content [data-fieldname="city"]')
      .last()
    this.stateInput = page
      .locator('.modal-content [data-fieldname="state"]')
      .last()
    this.countryInput = page
      .locator('.modal-content [data-fieldname="country_address"]')
      .last()
    this.saveButton = page
      .locator('.modal-footer .standard-actions .es-button__label')
      .last()
  }

  async createCustomer(customer: Customer): Promise<void> {
    await this.customerNameInput.fill(customer.customerName)

    await this.customerTypeDropdown.selectOption({
      label: customer.customerType,
    })
    await this.firstNameInput.fill(customer.firstName)
    await this.lastNameInput.fill(customer.lastName)
    await this.mobileNumberInput.fill(customer.mobileNumber.toString())
    await this.addressLine1Input.fill(customer.addressLine1)
    await this.addressLine2Input.fill(customer.addressLine2 || '')
    await this.zipCodeInput.fill(customer.zipCode)
    await this.page.waitForTimeout(1000)
    await this.cityInput.fill(customer.city)
    await this.stateInput.fill(customer.state)
    await this.countryInput.fill(customer.country)
    await this.page
      .getByRole('option', { name: customer.country, exact: true })
      .last()
      .click()
    await this.saveButton.click()
    await expect(
      this.page.getByText(`${customer.customerName} saved`)
    ).toBeVisible()
  }

  async asserCustomerCreated(customerName: string): Promise<void> {
    await expect(this.page.locator(`[title="${customerName}"]`)).toBeVisible()
  }
}
