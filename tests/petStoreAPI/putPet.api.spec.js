// @ts-check
const { test, expect } = require('@playwright/test');
const validStatuses = ["available", "pending", "sold"];
import { createPet, deletePet, updatePet, getPet } from "../../helpers/pet.js";
require('dotenv').config();
let createdPet;

test.describe('Tests for PUT /pet',{tag:'@api'}, () => {
    test.beforeEach(async () => {
        //Creates the pet to modify with PUT request
        createdPet = await createPet();


    })
    test.afterEach(async () => {
        //Deletes the ´created pet after each test
        await deletePet(createdPet.id)
    })

    test('Send a valid request and make sure all values are updated correctly.', async () => {
        var response;
        var responseBody;

        var modifiedPet = {
            ...createdPet,
            category: { id: 1, name: "modifiedCategoryName" },
            name: "modifiedName",
            photoUrls: ["testurl.com"],
            tags: [{ id: 2, name: "female" }],
            status: "pending"
        };
        response = await updatePet(modifiedPet) // Update pet
        expect(response.status).toBe(200)
        expect(response.body).toStrictEqual(modifiedPet)

        responseBody = await getPet(createdPet.id) //Get pet by original ID
        expect(responseBody).toStrictEqual(modifiedPet)  //Assert that pet has been modified as said

    })

    test('Send a request with invalid status, it should return status code 405 Validation Exception.', async () => {
        var response;
        var modifiedPet = {
            ...createdPet,
            status: "invalidStatus"
        };

        response = await updatePet(modifiedPet);
        //This should return a validation exception according to documentation
        expect(response.status).toBe(405)

    })

    test('Send a request with invalid status, status should not be saved.', async () => {
        var response;
        var responseBody;
        var modifiedPet = {
            ...createdPet,
            status: "invalid"
        };

        response = await updatePet(modifiedPet);
        //Get the updated Pet to assert status has allowed value
        response = await getPet(createdPet.id);

        var hasValidStatus = validStatuses.some(status => status === response.status)

        expect(hasValidStatus).toBe(true)
    })

    test('Send a request without a name, it should return status code 405 Validation Exception.', async () => {
        var response;
        var modifiedPet = {
            ...createdPet,
        };
        delete modifiedPet.name;
        //Update without name field
        response = await updatePet(modifiedPet)
        //This should return a validation exception according to documentation
        expect(response.status).toBe(405)
    })

    test('Send a request without a name, it should not remove name from pet.', async () => {
        var response;
        var responseBody;
        //Send object without name
        var modifiedPet = {
            ...createdPet,
        };
        delete modifiedPet.name;
        await updatePet(modifiedPet);
        //The name should not be removed from pet
        response = await getPet(modifiedPet.id)
        expect(response.name).toBeDefined();

    })
})

