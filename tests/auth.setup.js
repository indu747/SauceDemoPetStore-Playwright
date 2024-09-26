import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authDir = path.join(__dirname, '../playwright/.auth');
const authFile = path.join(authDir, 'user.json');

setup('authenticate', async ({ page }) => {
  /** Usually i would authenticate with API but since saucedemo.com 
  *   seems to handle the log in with just javascript and by setting a cookie I just mock the
  *   the cookie that authenticates a user.
  */
  const currentDate = new Date();
  const expiresIn10Minutes = new Date(currentDate.getTime() + 10 * 60 * 1000); // 10 minutes in milliseconds

  const cookie = {
    name: 'session-username',
    value: 'standard_user',
    domain: 'www.saucedemo.com',
    path: '/',
    expires: expiresIn10Minutes.getTime() / 1000,  // Convert to UNIX timestamp in seconds
    size: 29,
    httpOnly: false,
    secure: true, // Set this to 'false' if using HTTP instead of HTTPS
    priority: 'Medium'
  };
  const context = page.context();
  // Set the cookie in the browser context
  await context.addCookies([cookie]);

  // Navigate to a page to confirm that the cookie has taken effect
  await page.goto('https://www.saucedemo.com/inventory.html');

  await page.context().storageState({ path: authFile });

});