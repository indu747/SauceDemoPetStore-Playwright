const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.loginTitle = page.locator('.login_logo')
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]')
    this.errorMessage = page.locator('[data-test="error"]')
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async enterUsername(username) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }
  async clickLoginButton() {
    await this.loginButton.click();
  }
  async cookieIsNotSet(context) {
    var cookies = await context.cookies();
    expect(cookies).toHaveLength(0);
  }
  async cookieIsSet(context) {
    var cookies = await context.cookies();
    expect(cookies).toHaveLength(1);
  }
};