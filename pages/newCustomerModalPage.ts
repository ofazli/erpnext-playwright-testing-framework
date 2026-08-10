import { expect, type Locator, type Page } from '@playwright/test'

import type { Customer } from '../models/Customer'

export class NewCustomerModalPage {
  private readonly customerNameInput: Locator
  private readonly customerTypeDropdown: Locator
  private readonly emailIdInput: Locator
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
      .locator(
        '.modal-content .input-with-feedback[data-fieldname="map_to_first_name"]'
      )
      .last()

    this.lastNameInput = page
      .locator(
        '.modal-content .input-with-feedback[data-fieldname="map_to_last_name"]'
      )
      .last()

    this.emailIdInput = page
      .locator(
        '.modal-content .input-with-feedback[data-fieldname="email_address"]'
      )
      .last()
    this.mobileNumberInput = page
      .locator(
        '.modal-content .input-with-feedback[data-fieldname="mobile_number"]'
      )
      .last()

    this.addressLine1Input = page
      .locator(
        '.modal-content .input-with-feedback[data-fieldname="address_line1"]'
      )
      .last()
    this.addressLine2Input = page
      .locator(
        '.modal-content .input-with-feedback[data-fieldname="address_line2"]'
      )
      .last()
    this.zipCodeInput = page
      .locator('.modal-content .input-with-feedback[data-fieldname="pincode"]')
      .last()
    this.cityInput = page
      .locator('.modal-content .input-with-feedback[data-fieldname="city"]')
      .last()
    this.stateInput = page
      .locator('.modal-content .input-with-feedback[data-fieldname="state"]')
      .last()
    this.countryInput = page
      .locator(
        '.modal-content .input-with-feedback[data-fieldname="country_address"]'
      )
      .last()
    this.saveButton = page
      .locator('.modal-footer .standard-actions .es-button__label')
      .last()
  }

  private async fillAndAssert(input: Locator, value: string): Promise<void> {
    await expect(input).toBeVisible()
    await expect(input).toBeEnabled()
    await input.fill(value)
    await expect(input).toHaveValue(value)
  }

  async createCustomer(customer: Customer): Promise<void> {
    // Customer name field
    await this.fillAndAssert(this.customerNameInput, customer.customerName)

    // Customer type dropdown field
    await this.customerTypeDropdown.selectOption({
      label: customer.customerType,
    })

    //Customer FirstName Field
    await this.fillAndAssert(this.firstNameInput, customer.firstName)
    //Customer LastName Field
    await this.fillAndAssert(this.lastNameInput, customer.lastName)
    //Customer Emailid Field
    await this.fillAndAssert(this.emailIdInput, customer.emailId)
    //Customer MobileNumber Field
    await this.fillAndAssert(
      this.mobileNumberInput,
      customer.mobileNumber.toString()
    )
    //Customer AddressLine1 Field
    await this.fillAndAssert(this.addressLine1Input, customer.addressLine1)
    //Customer AddressLine2 Field
    await this.fillAndAssert(
      this.addressLine2Input,
      customer.addressLine2 || ''
    )
    //Customer ZipCode Field
    await this.fillAndAssert(this.zipCodeInput, customer.zipCode)
    //Customer City Field
    await this.fillAndAssert(this.cityInput, customer.city)
    //Customer State Field
    await this.fillAndAssert(this.stateInput, customer.state)
    //Customer Country Field
    await this.countryInput.fill(customer.country)
    await this.page
      .getByRole('option', { name: customer.country, exact: true })
      .last()
      .click()

    await this.saveButton.click()

    await expect(this.page.getByText('Missing Values Required')).toHaveCount(0)
    await expect(
      this.page.getByText(`${customer.customerName} saved`)
    ).toBeVisible()
  }

  async asserCustomerCreated(customerName: string): Promise<void> {
    await expect(this.page.locator(`[title="${customerName}"]`)).toBeVisible()
  }
}
