import { test, expect } from "@playwright/test";

test('Login automatique pour OrangeHRM', async ({ page }) => {

  console.log(" Ouvre la page de login");
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  console.log(" Remplir les champs login");
  await page.locator('input[name="username"]').fill('Admin');
  await page.locator('input[name="password"]').fill('admin123');

  console.log("Cliquer sur Login");
  await page.locator('button:has-text("Login")').click();

  console.log("Attendre le Dashboard");
  await page.waitForURL('**/dashboard**', { timeout: 15000 });

  await expect(
    page.locator('h6:has-text("Dashboard")')
  ).toBeVisible();

  console.log("Login réussi");

  await page.context().storageState({ path: 'storageState.json' });
});
