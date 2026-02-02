import { test, expect } from "@playwright/test";
import { AjoutPage } from "../../pages/ajoutPage";

test.use({ storageState: "storageState.json" });

test.describe("Admin – Ajouter utilisateur", () => {
  test("Ajouter un utilisateur valide", async ({ page }) => {
    const ajoutPage = new AjoutPage(page);

    await ajoutPage.goto();
    await ajoutPage.openAddUser();

    await ajoutPage.fillUserForm({
      role: "ESS",
      employeeName: "Orange Test",
      username: "user003",
      status: "Enabled",
      password: "Password@123",
      confirmPassword: "Password@123",
    });

    await ajoutPage.save();

    await expect(ajoutPage.getSuccessToast()).toBeVisible();
  });
});
