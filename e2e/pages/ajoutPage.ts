import { Page, Locator } from "@playwright/test";

export class AjoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // =======================
  // Navigation
  // =======================

  async goto() {
    await this.page.goto("/web/index.php/admin/viewSystemUsers");
    await this.page.waitForLoadState("networkidle");
  }

  async openAddUser() {
    await this.page.getByRole("button", { name: "Add" }).click();
    await this.page.waitForSelector("h6:has-text('Add User')");
  }

  // =======================
  // Helpers
  // =======================

  private async openDropdown(label: string) {
    const dropdown = this.page
      .locator(".oxd-input-group")
      .filter({ hasText: label })
      .locator(".oxd-select-text");

    await dropdown.click();
  }

  private async selectOption(option: string) {
    await this.page
      .locator(".oxd-select-dropdown")
      .getByText(option, { exact: true })
      .click();
  }

  private async fillTextInput(label: string, value: string) {
    const group = this.page
      .locator(".oxd-input-group")
      .filter({ hasText: label })
      .first(); // 🔥 évite toute ambiguïté

    await group.locator("input").fill(value);
  }

  private async fillPassword(value: string) {
    await this.page.locator("input[type='password']").nth(0).fill(value);
  }

  private async fillConfirmPassword(value: string) {
    await this.page.locator("input[type='password']").nth(1).fill(value);
  }

  // =======================
  // Form logic
  // =======================

  async fillUserForm(data: {
    role: string;
    employeeName: string;
    username: string;
    status: string;
    password: string;
    confirmPassword: string;
  }) {
    // User Role
    await this.openDropdown("User Role");
    await this.selectOption(data.role);

    // Employee Name (autocomplete)
    const employeeInput = this.page.getByPlaceholder("Type for hints...");
    await employeeInput.fill(data.employeeName);

    await this.page
      .locator(".oxd-autocomplete-dropdown")
      .getByText(data.employeeName)
      .click();

    // Username
    await this.fillTextInput("Username", data.username);

    // Status
    await this.openDropdown("Status");
    await this.selectOption(data.status);

    // Passwords ✅ FIX DÉFINITIF
    await this.fillPassword(data.password);
    await this.fillConfirmPassword(data.confirmPassword);
  }

  // =======================
  // Actions & assertions
  // =======================

  async save() {
    await this.page.getByRole("button", { name: "Save" }).click();
  }

  getSuccessToast(): Locator {
    return this.page.locator(".oxd-toast--success");
  }
}
