import { expect, request } from "@playwright/test";
import { faker } from "@faker-js/faker";
require('dotenv').config();

export async function createRandomPetBody() {
    let petStatus = ["available", "pending", "sold"];

    let petBody = {
        id: faker.number.int({ min: 30000, max: 90000 }),
        category: {
            id: faker.number.int({ min: 1, max: 20 }),
            name: faker.animal.type()
        },
        name: faker.person.firstName(),
        photoUrls: [
            faker.image.urlPicsumPhotos(),
        ],
        tags: [
            {
                id: faker.number.int({ min: 1, max: 2 }),
                name: faker.person.sex()
            }
        ],
        status: petStatus[Math.floor(Math.random() * petStatus.length)],
    };

    return petBody;
}

export async function createPet() {
    const createRequestContext = await request.newContext();
    var randomPet = await createRandomPetBody();
    const response = await createRequestContext.post('https://petstore.swagger.io/v2/pet/', {
        data: randomPet,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    expect(response.status()).toBe(200);
    var body = await response.json();
    return body;
}

export async function updatePet(modifiedPet) {
    const createRequestContext = await request.newContext();
    const response = await createRequestContext.put('https://petstore.swagger.io/v2/pet/', {
        data: modifiedPet,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    expect(response.status()).toBe(200);
    return { status: response.status(), body: await response.json() };
}

export async function getPet(id) {
    const createRequestContext = await request.newContext();
    const response = await createRequestContext.get(`https://petstore.swagger.io/v2/pet/${id}`)
    expect(response.status()).toBe(200);
    var body = await response.json();
    return body;
}


export async function deletePet(id) {
    const createRequestContext = await request.newContext();
    const response = await createRequestContext.delete(`https://petstore.swagger.io/v2/pet/${id}`, {
        headers: {
            'api_key': 'special-key'
        }
    });
    const responseBody = await response.json()

    expect(response.status()).toBe(200);
    expect(responseBody.message).toBe(id.toString())
}
export async function isEmpty(response) {
    const responseBody = await response.json()
    const isEmpty = Object.keys(responseBody).length === 0;
    return  isEmpty

}
