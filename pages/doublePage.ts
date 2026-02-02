import { Page } from "@playwright/test";

export class AdminPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Aller sur la page System Users
  async goto() {
    await this.page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers"
    );

    // Attendre le layout principal
    await this.page.waitForSelector('div.oxd-layout', { timeout: 30000 });

    // Vérifier si le titre existe (optionnel, ne bloque pas)
    const title = this.page.locator('h6.oxd-text:has-text("System Users")');
    if (await title.count() > 0) {
      await title.first().waitFor({ state: 'visible', timeout: 10000 });
    }
  }

  // Cliquer sur Add User
  async clickAddUser() {
    await this.page.locator('button:has-text("Add")').click();
    await this.page.waitForSelector('h6.oxd-text:has-text("Add User")', { timeout: 15000 });
  }

  private async openDropdown(label: string) {
    const dropdown = this.page
      .locator(".oxd-input-group")
      .filter({ hasText: label })
      .first()
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
      .first();

    await group.locator("input").fill(value);
  }

  async fillUserForm(data: {
    role?: string;
    employeeName?: string;
    userName?: string;
    status?: string;
    password?: string;
    confirmPassword?: string;
  }) {
    if (data.role) {
      await this.openDropdown("User Role");
      await this.selectOption(data.role);
    }

    if (data.employeeName) {
      await this.fillTextInput("Employee Name", data.employeeName);
      // Attendre la suggestion
      const suggestion = this.page.locator('.oxd-autocomplete-dropdown *', { hasText: data.employeeName }).first();
      await suggestion.waitFor({ state: 'visible', timeout: 5000 });
      await suggestion.click();
    }

    if (data.userName) {
      await this.fillTextInput("Username", data.userName);
    }

    if (data.status) {
      await this.openDropdown("Status");
      await this.selectOption(data.status);
    }

    if (data.password) {
      await this.fillTextInput("Password", data.password);
    }

    if (data.confirmPassword) {
      await this.fillTextInput("Confirm Password", data.confirmPassword);
    }
  }

  async submitForm() {
    await this.page.locator('button:has-text("Save")').click();
    await this.page.waitForSelector(
      'span.oxd-text.oxd-text--span.oxd-input-field-error-message, .oxd-toast--success',
      { timeout: 15000 }
    );
  }

  async getDuplicateUserError() {
    const error = this.page.locator('span.oxd-text.oxd-text--span.oxd-input-field-error-message');
    return error.textContent();
  }
}
