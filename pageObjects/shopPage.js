const { expect } = require('@playwright/test');

exports.ShopPage = class ShopPage {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.sortProductsMenu = page.locator("[data-test='product-sort-container']");
    this.productTitles = page.locator("[data-test='inventory-item-name']")
    this.productPrices = page.locator("[data-test='inventory-item-price']")
    this.allAddToShoppingCartButtons = page.locator('[data-test*="add-to-cart"]')
    this.allRemoveFromCartButtons = page.locator('[data-test*="remove"]')
    this.shoppingCartBadge = page.locator('.shopping_cart_badge')

  }
  async goto() {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
  }
  async selectSorting(sorting) {
    await this.sortProductsMenu.selectOption(sorting)
  }
  async getAllProductTitles() {
    const titles = await this.productTitles.allInnerTexts()
    return titles

  }
  async getAllProductPricesNumerical() {
    let textPrices = await this.productPrices.allInnerTexts()
    const prices = textPrices.map(priceText => parseFloat(priceText.replace('$', '')));
    return prices
  }
 
  async addFirstProductToCart() {
    await this.allAddToShoppingCartButtons.first().click();
  }

  async removeFirstProductFromCart() {
    await this.allRemoveFromCartButtons.first().click();
  }
};