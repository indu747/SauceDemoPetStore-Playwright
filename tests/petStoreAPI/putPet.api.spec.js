// @ts-check
const { test, expect } = require('@playwright/test');
const { WebUtils } = require('../../pageObjects/WebUtils.js');
const { describe } = require('node:test');
const validStatuses = ["available", "pending", "sold"]
require('dotenv').config();

describe('Tests for PUT /pet', () => {
    let webUtils;
    test.beforeEach(async ({ page,request }) => {
        webUtils = new WebUtils(page)
        //Creates the pet to modify with PUT request
        await webUtils.addPet(request)

    })
    test.afterEach(async ({ page,request}) => {
        webUtils = new WebUtils(page)
        //Deletes the pet after each test
        await webUtils.deletePet(request)
    })

    test('Send a valid request and make sure all values are updated correctly.', async ({ request }) => {
        var response;
        var responseBody;
        
        response = await request.put('https://petstore.swagger.io/v2/pet/', { data: webUtils.updatedPet });
        responseBody = await response.json()
        expect(response.status()).toBe(200);
        response = await request.get(`https://petstore.swagger.io/v2/pet/${webUtils.updatedPet.id}`)
        responseBody = await response.json()

        expect(responseBody).toStrictEqual(webUtils.updatedPet)

    })

    test('Send a request with invalid status, it should not go through or update previous values.', async ({ request }) => {
        var response;
        var responseBody;

        response = await request.put('https://petstore.swagger.io/v2/pet/', { data: webUtils.invalidStatus });
        //This should return a validation exception according to documentation
        expect(response.status()).toBe(405)
        responseBody = await response.json()

        //Get the updated Pet to assert status has allowed value
        response = await request.get(`https://petstore.swagger.io/v2/pet/${webUtils.updatedPet.id}`)
        responseBody = await response.json()
        var valueExistInArray = validStatuses.some(status => status ===responseBody.status)
        
        expect(valueExistInArray).toBe(true)
    })

    test('Send a request without a name, it should not go through or update previous values.', async ({ request }) => {
        var response;
        var responseBody;
        //Update without name field
        response = await request.put('https://petstore.swagger.io/v2/pet/', { data: webUtils.noNamePet });
        responseBody = await response.json()
        //This should return a validation exception according to documentation
        expect(response.status()).toBe(405)
        //Get the updated Pet to assert pet has a name
        response = await request.get(`https://petstore.swagger.io/v2/pet/${webUtils.noNamePet.id}`)
        responseBody = await response.json()
        //This name should not be altered
        expect(responseBody.name).toBeDefined()

    })
})

