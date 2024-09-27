// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pageObjects/loginPage.js');
const { log } = require('console');
require('dotenv').config();

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login Feature',{tag:'@e2e'}, () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goto();
  })

  test('Verify the correct header is displayed on the login page.', async () => {
    const titleText = await loginPage.loginTitle.innerText();
    expect(titleText).toBe("Swag Labs");

  })
  test('When the user has not typed in a string in the username field correct placeholder is displayed', async () => {
    const placeholderText = await loginPage.usernameInput.getAttribute('placeholder');
    expect(placeholderText).toBe("Username");

  });
  test('When the user has not typed in a string in the password field a placeholder is displayed.', async () => {
    const placeholderText = await loginPage.passwordInput.getAttribute('placeholder');
    expect(placeholderText).toBe("Password");

  });

  test('User fills out password but no username. Username should be required. ', async ({ context }) => {
    await loginPage.enterPassword(process.env.PASSWORD);
    await loginPage.clickLoginButton();
    const errorMessage = await loginPage.errorMessage.innerText();
    expect(errorMessage).toEqual("Epic sadface: Username is required");
    await loginPage.cookieIsNotSet(context);




  })

  test('User fills out username but no password. Password should be required.', async ({ page, context }) => {
    await loginPage.enterUsername(process.env.CUTOMER_1_USERNAME);
    await loginPage.clickLoginButton();
    const errorMessage = await loginPage.errorMessage.innerText();
    expect(errorMessage).toEqual("Epic sadface: Password is required");
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    await loginPage.cookieIsNotSet(context);
  })

  test('User can not log in with invalid username but valid password.', async ({ page, context }) => {
    await loginPage.enterUsername("invalid_username");
    await loginPage.enterPassword(process.env.PASSWORD);
    await loginPage.clickLoginButton();
    const errorMessage = await loginPage.errorMessage.innerText();
    expect(errorMessage).toEqual("Epic sadface: Username and password do not match any user in this service")
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    await loginPage.cookieIsNotSet(context);


  })

  test('User can not log in with valid username but invalid password.', async ({ page, context }) => {
    await loginPage.enterUsername(process.env.CUTOMER_1_USERNAME);
    await loginPage.enterPassword("invalid_password");
    await loginPage.clickLoginButton();
    const errorMessage = await loginPage.errorMessage.innerText();
    expect(errorMessage).toEqual("Epic sadface: Username and password do not match any user in this service");
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    await loginPage.cookieIsNotSet(context);
  })

  test('User can not login with empty credentials', async ({ page, context }) => {
    await loginPage.clickLoginButton();
    const errorMessage = await loginPage.errorMessage.innerText();
    expect(errorMessage).toEqual("Epic sadface: Username is required");
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    await loginPage.cookieIsNotSet(context);
  })

  test('User can not login with valid but upper case credentials', async ({ page, context }) => {
    await loginPage.enterUsername(process.env.CUTOMER_1_USERNAME?.toUpperCase());
    await loginPage.enterPassword(process.env.PASSWORD?.toUpperCase());
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    await loginPage.cookieIsNotSet(context);

  })


  test('User can log in with valid credentials', async ({ page, context }) => {
    await loginPage.enterUsername(process.env.CUTOMER_1_USERNAME);
    await loginPage.enterPassword(process.env.PASSWORD);
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    await loginPage.cookieIsSet(context)
  })

})
