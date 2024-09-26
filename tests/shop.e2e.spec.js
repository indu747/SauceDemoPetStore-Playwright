// @ts-check
const { test, expect } = require('@playwright/test');
const { ShopPage } = require('../pageObjects/shopPage.js');
const { assert } = require('console');
const { text } = require('stream/consumers');
require('dotenv').config();

test.describe('Shop Feature', () => {
  test.describe.configure({ mode: 'parallel' });
  let shopPage;
  test.beforeEach(async ({ page }) => {
    shopPage = new ShopPage(page)
    await shopPage.goto();
  })

  test('Test that user can sort alphabetically Z -> A', async ({ page }) => {
    /*
      1. Sort z-a
      2. Get all product titles
      3. Make a copy of product titles and sort the array
      4. Assert that arrays are the same
    */
    await shopPage.selectSorting('za')
    const titleArray = await shopPage.getAllProductTitles();
    console.log(titleArray)
    const sortedArray = [...titleArray].sort((a, b) => b.localeCompare(a));
    expect(titleArray).toEqual(sortedArray);
  })

  test('Test that user can sort alphabetically A -> Z', async ({ page }) => {
    /*
      1. Sort z-a first to make sure default sorting doesnt hinder result
      2. Sort a-z
      3. Get all product titles
      4. Make a copy of product titles and sort the array
      5. Assert that arrays are the same
    */
    await shopPage.selectSorting('za')
    await shopPage.selectSorting('az')
    const titleArray = await shopPage.getAllProductTitles();
    const sortedArray = [...titleArray].sort((a, b) => a.localeCompare(b));
    expect(titleArray).toEqual(sortedArray);
  })

  test('Test that user can sort products by price High to Low', async ({ page }) => {
    await shopPage.selectSorting('hilo')
    const numericalPriceArray = await shopPage.getAllProductPricesNumerical();
    console.log(numericalPriceArray)

    const sortedPriceArray = [...numericalPriceArray].sort((a, b) => b - a);
    console.log(sortedPriceArray)
    expect(numericalPriceArray).toEqual(sortedPriceArray);
  })
  test('Test that user can sort products by price Low to High', async ({ page }) => {
    await shopPage.selectSorting('lohi')
    const numericalPriceArray = await shopPage.getAllProductPricesNumerical();
    console.log(numericalPriceArray)

    const sortedPriceArray = [...numericalPriceArray].sort((a, b) => a - b);
    console.log(sortedPriceArray)
    expect(numericalPriceArray).toEqual(sortedPriceArray);
  })

  test('When user adds a product to cart it is visible in the navbar', async ({ page }) => {
    await shopPage.addFirstProductToCart()
    let amountOfProductsInCart = parseInt(await shopPage.shoppingCartBadge.innerText());
    expect(amountOfProductsInCart).toEqual(1)

  })

  test('When user removes all product from shopping cart it is no longer visible in the navbar', async ({ page }) => {
    await shopPage.addFirstProductToCart()
    await expect(shopPage.shoppingCartBadge).toBeVisible()
    await shopPage.removeFirstProductFromCart()
    await expect(shopPage.shoppingCartBadge).not.toBeVisible()
  })
});

