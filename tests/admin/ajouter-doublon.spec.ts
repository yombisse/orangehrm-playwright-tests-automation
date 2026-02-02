import { test, expect } from "@playwright/test";
import { AdminPage } from "../../pages/doublePage";

test.use({ storageState: 'storageState.json' });

test("Ajouter un utilisateur avec nom déjà existant", async ({ page }) => {
  const admin = new AdminPage(page);

  // Aller sur la page Admin / System Users
  await admin.goto();

  // Cliquer sur Add User
  await admin.clickAddUser();

  // Remplir le formulaire et créer l'utilisateur
  await admin.fillUserForm({
    role: "ESS",
    employeeName: "Orange Test",
    userName: "user001",
    status: "Enabled",
    password: "Password@123",
    confirmPassword: "Password@123",
  });

  // Cliquer sur Save
  await admin.page.locator('button:has-text("Save")').click();

  // Attendre le toast de succès
  await admin.page.waitForSelector('.oxd-toast--success', { timeout: 10000 });

  // Retourner à la page System Users et cliquer sur Add User à nouveau
  await admin.goto();
  await admin.clickAddUser();

  // Remplir le formulaire avec le même nom d'utilisateur
  await admin.fillUserForm({
    role: "ESS",
    employeeName: "Orange Test",
    userName: "user001", // même utilisateur
    status: "Enabled",
    password: "Password@123",
    confirmPassword: "Password@123",
  });

  // Cliquer sur Save
  await admin.page.locator('button:has-text("Save")').click();

  // Attendre et vérifier le message d'erreur
  const errorText = await admin.getDuplicateUserError();
  expect(errorText).toMatch(/Already exists/i);

  console.log("Le test de doublon utilisateur a été vérifié avec succès !");
});
