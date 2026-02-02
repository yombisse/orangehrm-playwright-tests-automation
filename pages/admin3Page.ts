import { Page, Locator } from "@playwright/test";

export interface UserSearchResult {
  username: string;
  role: string;
  employeeName: string;
  status: string;
}

export class AdminPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/web/index.php/admin/viewSystemUsers");
    await this.page.waitForLoadState("networkidle");
  }

  private async fillInputByLabel(label: string, value: string) {
    const input = this.page.locator(`.oxd-input-group:has-text("${label}") input`);
    await input.fill(value);
  }

  private async selectDropdownOption(label: string, option: string) {
    const dropdown = this.page.locator(`.oxd-input-group:has-text("${label}") .oxd-select-text`);
    await dropdown.click();
    await this.page.locator(".oxd-select-dropdown .oxd-select-option").filter({ hasText: option }).click();
  }

  async searchUser(username: string) {
    await this.fillInputByLabel("Username", username);
    await this.page.getByRole("button", { name: "Search" }).click();
    await this.page.waitForTimeout(1000);
  }

  async searchUserWithCriteria(criteria: {
    username?: string;
    role?: string;
    status?: string;
    employeeName?: string;
  }) {
    if (criteria.username) await this.fillInputByLabel("Username", criteria.username);
    if (criteria.employeeName) await this.fillInputByLabel("Employee Name", criteria.employeeName);
    if (criteria.role) await this.selectDropdownOption("User Role", criteria.role);
    if (criteria.status) await this.selectDropdownOption("Status", criteria.status);

    await this.page.getByRole("button", { name: "Search" }).click();
    await this.page.waitForTimeout(1000);
  }

  // =======================
  // Récupération résultats
  // =======================
  async getSearchResults(): Promise<UserSearchResult[]> {
    const rows = this.page.locator(".oxd-table-body .oxd-table-card");
    const count = await rows.count();
    const results: UserSearchResult[] = [];

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const cells = row.locator(".oxd-table-cell");

      // On récupère les colonnes selon l'ordre réel (username, role, employeeName, status)
      results.push({
        username: await cells.nth(1).innerText(),
        role: await cells.nth(2).innerText(),
        employeeName: await cells.nth(3).innerText(),
        status: await cells.nth(4).innerText(), // ici, colonne status corrigée
      });
    }

    return results;
  }

  async firstResultUsername(): Promise<string> {
    const firstRow = this.page.locator(".oxd-table-body .oxd-table-card").first();
    return firstRow.locator(".oxd-table-cell").nth(1).innerText();
  }

  getNoResultsMessage(): Locator {
    return this.page.locator('span:has-text("No Records Found")');
  }
}
