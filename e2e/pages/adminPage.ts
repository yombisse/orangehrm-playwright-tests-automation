import { Page, Locator } from "@playwright/test";

export class AdminPage {
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

  // =======================
  // Helpers dropdown / input
  // =======================
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

  // =======================
  // Recherche utilisateur
  // =======================
  async searchUser(username: string) {
    await this.fillTextInput("Username", username);
    await this.page.getByRole("button", { name: "Search" }).click();
    // Attendre la table se mettre à jour
    await this.page.waitForTimeout(1000);
  }

  // =======================
  // Ouvrir édition
  // =======================
  async openEditFor(username: string) {
    const row = this.page.locator(".oxd-table-row").filter({ hasText: username });
    await row.locator('button i.bi-pencil-fill').click();
    await this.page.waitForSelector("h6:has-text('Edit User')");
  }

  // =======================
  // Update form
  // =======================
  async updateUserForm(data: { status?: string }) {
    if (data.status) {
      await this.openDropdown("Status");
      await this.selectOption(data.status);
    }
  }

  async save() {
    await this.page.getByRole("button", { name: "Save" }).click();
    // attendre que toast apparaisse
    await this.page.waitForSelector(".oxd-toast--success");
  }

  // =======================
  // Assertions helpers
  // =======================
  getSuccessToast(): Locator {
    return this.page.locator(".oxd-toast--success");
  }

  getUserStatus(username: string): Locator {
    const row = this.page.locator(".oxd-table-row").filter({ hasText: username });
    // Status = 5ème colonne (index 4)
    return row.locator(".oxd-table-cell").nth(4);
  }
}
