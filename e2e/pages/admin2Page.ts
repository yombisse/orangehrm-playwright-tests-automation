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
  // Actions sur la page
  // =======================
  async clickAddUser() {
    await this.page.getByRole("button", { name: "Add" }).click();
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
    // Attendre que la table se mette à jour
    await this.page.waitForTimeout(1000);
  }

  // =======================
  // Supprimer utilisateur
  // =======================
  async deleteUser(username: string) {
    const row = this.page.locator(".oxd-table-row").filter({ hasText: username });

    // Cliquer sur le bouton Delete (icône poubelle)
    await row.locator('button i.bi-trash').click();

    // Confirmer la suppression dans le modal
    await this.page.locator('button:has-text("Yes, Delete")').click();

    // Attendre le toast de succès
    await this.page.waitForSelector(".oxd-toast--success");
  }
  // =======================
  // Formulaire d'ajout utilisateur
  // =======================
  getSuccessToast(): Locator {
    return this.page.locator(".oxd-toast--success");
  }
}
