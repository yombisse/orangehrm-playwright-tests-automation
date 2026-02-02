import { Page } from "@playwright/test";

export class AdminPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Aller sur la page Admin - System Users
  async goto() {
    await this.page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers");

    // Attendre que le conteneur principal de la page soit chargé
    await this.page.waitForSelector('div.oxd-layout', { timeout: 30000 });

    // Optionnel : attendre que le titre "System Users" apparaisse si visible
    const title = this.page.locator('h6.oxd-text');
    if (await title.count() > 0) {
      await title.first().waitFor({ state: 'visible', timeout: 30000 });
    }
  }

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
      const employeeInput = this.page.getByPlaceholder("Type for hints...");
      await employeeInput.fill(data.employeeName);
      await this.page
        .locator(".oxd-autocomplete-dropdown")
        .getByText(data.employeeName)
        .click();
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
    await this.page.waitForSelector('.oxd-toast--success', { timeout: 15000 });
  }

  async searchUser(name: string) {
    await this.page.locator('input[placeholder="Type for hints..."]').fill(name);
    await this.page.locator('button:has-text("Search")').click();
    await this.page.waitForSelector(`div.oxd-table-cell:has-text("${name}")`, { timeout: 15000 });
  }
}
