// @ts-check
const { test, expect } = require('@playwright/test');
const validStatuses = ["available", "pending", "sold"]
import { isEmpty } from "../../helpers/pet.js";
require('dotenv').config();

test.describe('Tests for GET /pet/findByStatus',{tag:'@api'}, () => {

    test('Send a valid request request with each of the allowed statuses. Make sure that we only get pets with correct status back.', async ({ request }) => {
        for (const validStatus of validStatuses) {
            const response = await request.get(`https://petstore.swagger.io/v2/pet/findByStatus?status=${validStatus}`);
            const pets = await response.json()
            expect(response.status()).toBe(200); 

            for (const pet of pets) {
                expect(pet.status).toBe(validStatus)
            }
        }
    });
    test('Send request with numerical status. Make sure response is empty and validation fails.', async ({ request }) => {
        const response = await request.get('https://petstore.swagger.io/v2/pet/findByStatus?status=222');
        expect(response.status()).toBe(400) //This fails
        expect(await isEmpty(response)).toBe(true);//this passes
         
    });
    test('Send request with Array status. Make sure response is empty and validation fails.', async ({ request }) => {
        const response = await request.get('https://petstore.swagger.io/v2/pet/findByStatus?status=[1,2,3,4,5,6,7,8,9,10]');
        expect(response.status()).toBe(400) //This fails
        expect(await isEmpty(response)).toBe(true); //this passes
    })




})