import { test, expect } from "@playwright/test";
import { AdminPage } from "../../pages/admin3Page";

test.use({ storageState: 'storageState.json' });

test.describe("Recherche utilisateurs - Admin", () => {
  let admin: AdminPage;

  test.beforeEach(async ({ page }) => {
    admin = new AdminPage(page);
    await admin.goto(); // va sur la page Admin Users
  });

  test("Rechercher un utilisateur existant", async () => {
    await admin.searchUser("Admin");
    const firstUsername = await admin.firstResultUsername();
    await expect(firstUsername).toContain("Admin");
  });

  test("Rechercher un utilisateur inexistant", async () => {
    await admin.searchUser("NonExistentUser123");
    const noResults = await admin.getNoResultsMessage();
    await expect(noResults).toBeVisible();
  });

  test("Rechercher avec des critères multiples", async () => {
    const criteria = {
      role: "Admin",
      status: "Enabled",
      employeeName: "manda user"
    };

    await admin.searchUserWithCriteria(criteria);

    const results = await admin.getSearchResults();
    expect(results.length).toBeGreaterThan(0);

    // Au moins un résultat doit correspondre exactement aux critères
    const matched = results.filter(r =>
      r.role === criteria.role &&
      r.status === criteria.status &&
      r.employeeName.includes(criteria.employeeName)
    );

    expect(matched.length).toBeGreaterThan(0); // Test passe si on a au moins un match
  });

  test("Rechercher sans critères", async () => {
    await admin.searchUserWithCriteria({});
    const results = await admin.getSearchResults();
    expect(results.length).toBeGreaterThan(0); // table doit contenir des utilisateurs
  });
});
