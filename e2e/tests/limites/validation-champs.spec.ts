import { test, expect } from "@playwright/test";
import { ChampPage } from "../../pages/champPage";

test.use({ storageState: "storageState.json" });

test.describe("Tests Champs Texte – Username (Admin)", () => {
  let champPage: ChampPage;

  test.beforeEach(async ({ page }) => {
    champPage = new ChampPage(page);
    await champPage.gotoAddUser();
    await champPage.fillMandatoryFieldsExceptUsername();
  });

  test("Username vide", async () => {
    await champPage.fillUsername("");
    await champPage.submit();
    await expect(champPage.getUsernameError()).toHaveText("Required");
  });

  test("Username trop long", async () => {
    await champPage.fillUsername("a".repeat(50));
    await champPage.submit();
    await expect(champPage.getUsernameError()).toContainText("Should not exceed");
  });

  test("Username avec caractères spéciaux", async () => {
    await champPage.fillUsername("user@#!");
    await champPage.submit();
    await expect(champPage.getUsernameError()).toBeVisible();
  });

  test("Username valide", async () => {
    await champPage.fillUsername("validUser_" + Date.now());
    await champPage.submit();
    await expect(champPage.getToastSuccess()).toBeVisible({ timeout: 10000 });
  });
});
