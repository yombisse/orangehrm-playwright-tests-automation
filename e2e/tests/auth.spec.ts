import { test, expect } from "@playwright/test";
import LoginPage from "../pages/loginPage";
import HomePage from "../pages/homePage";
import { Env } from "../frameworkConfig/env";

test.describe("Authentification OrangeHRM", () => {

  test("Login valide", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.visit();

    const homePage: HomePage = await loginPage.login(
      Env.USERNAME,
      Env.PASSWORD
    );

    await expect(page.locator("h6")).toContainText("Dashboard");
  });

  test("Login invalide - mot de passe incorrect", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.visit();

    await loginPage.login(Env.USERNAME, "wrongPassword");

    await expect(page).toHaveURL(/auth\/login/);
    await expect(page.locator(".oxd-alert-content-text"))
      .toHaveText("Invalid credentials");
  });

  test("Login invalide - utilisateur inexistant", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.visit();

    await loginPage.login(Env.UNKNOWN_USER, Env.PASSWORD);

    await expect(page).toHaveURL(/auth\/login/);
    await expect(page.locator(".oxd-alert-content-text"))
      .toHaveText("Invalid credentials");
  });

  test("Connexion avec champs vides", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.visit();

    await loginPage.login("", "");

    const messages = page.locator(".oxd-input-group__message");
    await expect(messages.nth(0)).toHaveText("Required");
    await expect(messages.nth(1)).toHaveText("Required");
  });

  test("Déconnexion après login valide", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.visit();

    const homePage: HomePage = await loginPage.login(
      Env.USERNAME,
      Env.PASSWORD
    );

    await expect(page.locator("h6")).toContainText("Dashboard");

    await homePage.getTopMenuComponent().logout();
    await expect(page).toHaveURL(/auth\/login/);
  });

  test.only("Déconnexion puis navigation directe", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.visit();

  const homePage: HomePage = await loginPage.login(
    Env.USERNAME,
    Env.PASSWORD
  );

  await homePage.getTopMenuComponent().logout();

  // Essayer d'accéder directement au dashboard
  await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");

  // Vérifier qu'on est bien redirigé vers la page de login
  await expect(page).toHaveURL(/auth\/login/);
});
});
