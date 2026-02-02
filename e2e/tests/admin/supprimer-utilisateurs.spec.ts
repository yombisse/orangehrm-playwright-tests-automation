import { test, expect } from "@playwright/test";
import { AdminPage } from "../../pages/admin2Page";

test.use({ storageState: 'storageState.json' });

test.describe("Admin – Supprimer utilisateur", () => {
  test("Supprimer un utilisateur existant", async ({ page }) => {
    const admin = new AdminPage(page);
    await admin.goto();

    // Rechercher l'utilisateur
    await admin.searchUser("user001");

    // Supprimer l'utilisateur
    await admin.deleteUser("user001");

    // Vérifier le toast de succès
    await expect(admin.getSuccessToast()).toBeVisible();

    // Rechercher à nouveau pour confirmer que l'utilisateur n'existe plus
    await admin.searchUser("user001");
    const noResults = page.locator('span:has-text("No Records Found")');
    await expect(noResults).toBeVisible();
  });
});
