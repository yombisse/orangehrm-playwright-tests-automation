import { test, expect } from "@playwright/test";
import { AdminPage } from "../../pages/adminPage";

test.use({ storageState: "storageState.json" });

test.describe("Admin – Modifier utilisateur", () => {
  test("Modifier un utilisateur existant", async ({ page }) => {
    const admin = new AdminPage(page);

    // Aller sur la page Admin
    await admin.goto();

    // Rechercher l'utilisateur à modifier
    await admin.searchUser("user001");

    // Ouvrir la page d'édition
    await admin.openEditFor("user001");

    // Modifier le statut
    await admin.updateUserForm({ status: "Disabled" });

    // Sauvegarder
    await admin.save();

    // Vérifier message succès
    await expect(admin.getSuccessToast()).toBeVisible();

    // Rechercher à nouveau l'utilisateur
    await admin.searchUser("user001");

    // Vérifier que le statut est bien "Disabled"
    const statusCell = admin.getUserStatus("user001");
    await expect(statusCell).toHaveText("Disabled", { timeout: 10000 });
  });
});
