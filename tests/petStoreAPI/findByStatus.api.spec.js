// @ts-check
const { test, expect } = require('@playwright/test');
const { WebUtils } = require('../../pageObjects/WebUtils.js');
const { describe } = require('node:test');
const validStatuses = ["available", "pending", "sold"]
const invalidStatus = "incomming"
require('dotenv').config();
test.use({ storageState: { cookies: [], origins: [] } });


let webUtils;

    describe('Tests for GET /pet/findByStatus', () => {

        test.beforeEach(async ({ page }) => {
            webUtils = new WebUtils(page)
    })
    test('Send a valid request request with each of the allowed statuses. Make sure that we only get pets with correct status back.', async ({ request }) => {
        for (const validStatus of validStatuses) {
            const response = await request.get(`https://petstore.swagger.io/v2/pet/findByStatus?status=${validStatus}`);
            const pets = await response.json()
            expect(response.status()).toBe(200); // Check if the response status is 200

            for (const pet of pets) {
                expect(pet.status).toBe(validStatus)
            }
        }
    });
    test('Send request with numerical status. Make sure response is empty and validation fails.', async ({ request }) => {
        const response = await request.get('https://petstore.swagger.io/v2/pet/findByStatus?status=222');
        expect(await webUtils.isEmpty(response)).toBe(true);
        expect(response.status()).toBe(400)
    });
    test('Send request with Array status. Make sure response is empty and validation fails.', async ({ request }) => {
        const response = await request.get('https://petstore.swagger.io/v2/pet/findByStatus?status=[1,2,3,4,5,6,7,8,9,10]');
        expect(await webUtils.isEmpty(response)).toBe(true);
        expect(response.status()).toBe(400);
    })




})