import { Page, Locator } from "@playwright/test";

export class ChampPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("input.oxd-input").nth(1);
    this.passwordInput = page.locator("input[type='password']").nth(0);
    this.confirmPasswordInput = page.locator("input[type='password']").nth(1);
    this.saveButton = page.locator("button[type='submit']");
  }

  async gotoAddUser() {
    await this.page.goto("/web/index.php/admin/viewSystemUsers");
    await this.page.waitForLoadState('load');
    await this.page.getByRole("button", { name: "Add" }).click();
    await this.page.waitForSelector("h6:has-text('Add User')");
  }

  async fillMandatoryFieldsExceptUsername() {
    // User Role
    const userRoleSelect = this.page.locator(".oxd-select-text").first();
    await userRoleSelect.waitFor({ state: 'visible' });
    await userRoleSelect.click();
    await this.page.getByRole("option", { name: "ESS" }).click();

    // Employee Name
    const empInput = this.page.locator("input[placeholder='Type for hints...']");
    await empInput.waitFor({ state: 'visible' });
    await empInput.fill("Orange Test");
    await this.page.locator(".oxd-autocomplete-dropdown").waitFor({ state: 'visible' });
    await this.page.locator(".oxd-autocomplete-dropdown").getByText("Orange Test").click();

    // Status
    const statusSelect = this.page.locator(".oxd-select-text").nth(1);
    await statusSelect.waitFor({ state: 'visible' });
    await statusSelect.click();
    await this.page.getByRole("option", { name: "Enabled" }).click();

    // Passwords valides
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.fill("Test@12345");

    await this.confirmPasswordInput.waitFor({ state: 'visible' });
    await this.confirmPasswordInput.fill("Test@12345");
  }

  async fillUsername(username: string) {
    const group = this.page.locator(".oxd-input-group").filter({ hasText: "Username" }).first();
    await group.locator("input").fill(username);
  }

  async submit() {
    await this.saveButton.waitFor({ state: 'visible' });
    await this.saveButton.click();
  }

  getUsernameError() {
    return this.page.locator('span.oxd-text.oxd-text--span.oxd-input-field-error-message');
  }

  getToastSuccess() {
    return this.page.locator(".oxd-toast--success");
  }
}
