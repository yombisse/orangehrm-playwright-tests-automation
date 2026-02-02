import { test, expect } from "@playwright/test";
import { AdminPage } from "../../pages/tempsPage";

test.use({ storageState: 'storageState.json' });

test.describe("Tests Performance - Admin", () => {
  let admin: AdminPage;

  test.beforeEach(async ({ page }) => {
    admin = new AdminPage(page);
  });

  test("Page Admin doit charger en moins de 30 secondes", async () => {
    const start = performance.now();
    await admin.goto();
    const duration = performance.now() - start;
    console.log(`Temps de chargement page Admin: ${duration.toFixed(2)} ms`);
    expect(duration).toBeLessThan(30000);
  });

  test("Ajouter utilisateur - performance < 10 secondes", async () => {
    await admin.goto();
    const start = performance.now();

    await admin.clickAddUser();

    // Utiliser un username unique pour éviter les conflits
    const uniqueUsername = `userPerf${Date.now()}`;

    await admin.fillUserForm({
      role: "ESS",
      employeeName: "Orange Test",
      userName: uniqueUsername,
      status: "Enabled",
      password: "Password@123",
      confirmPassword: "Password@123",
    });

    await admin.submitForm();

    const duration = performance.now() - start;
    console.log(`Temps pour ajouter utilisateur: ${duration.toFixed(2)} ms`);
    expect(duration).toBeLessThan(10000);
  });

  test("Rechercher utilisateur - performance < 5 secondes", async () => {
    await admin.goto();
    const start = performance.now();

    await admin.searchUser('Admin');

    const duration = performance.now() - start;
    console.log(`Temps pour rechercher utilisateur: ${duration.toFixed(2)} ms`);
    expect(duration).toBeLessThan(5000);
  });
});
