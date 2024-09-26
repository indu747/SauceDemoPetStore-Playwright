const { expect } = require('@playwright/test');

exports.WebUtils = class WebUtils {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.baseURL = 'https://petstore.swagger.io/v2/pet/'
        this.validPet = {
            "id": 93264,
            "category": {
                "id": 1,
                "name": "secretsauce"
            },
            "name": "secretsauce",
            "photoUrls": [
                "secretsauce.com"
            ],
            "tags": [
                {
                    "id": 0,
                    "name": "string"
                }
            ],
            "status": "available"
        }
        this.updatedPet = {
            "id": 93264,
            "category": {
                "id": 1,
                "name": "secretsauceUpdated"
            },
            "name": "secretsauceUpdated",
            "photoUrls": [
                "secretsauce.comUpdated"
            ],
            "tags": [
                {
                    "id": 1,
                    "name": "Updated"
                }
            ],
            "status": "pending"
        }
        this.invalidStatus= {
            "id": 93264,
            "category": {
                "id": 1,
                "name": "secretsauce"
            },
            "name": "secretsauce",
            "photoUrls": [
                "secretsauce.com"
            ],
            "tags": [
                {
                    "id": 0,
                    "name": "string"
                }
            ],
            "status": "exploitThis"
    
        }
        this.noNamePet = {
            "id": 93264,
            "category": {
                "id": 1,
                "name": "secretsauceUpdated"
            },
            "photoUrls": [
                "secretsauce.comUpdated"
            ],
            "tags": [
                {
                    "id": 1,
                    "name": "Updated"
                }
            ],
            "status": "not allowed"
        }

    }

    async addPet(request) {
        const response = await request.post('https://petstore.swagger.io/v2/pet/', { data: this.validPet });
        const responseBody = await response.json()
        expect(response.status()).toBe(200);
        expect(responseBody).toStrictEqual(this.validPet)
    }


    async deletePet(request) {
        const response = await request.delete(`https://petstore.swagger.io/v2/pet/${this.validPet.id}`, {
            headers: {
                'api_key': 'special-key'
            }
        });
        const responseBody = await response.json()

        expect(response.status()).toBe(200);
        expect(responseBody.message).toBe(this.validPet.id.toString())
    }
    async isEmpty(response) {
        const responseBody = await response.json()
        const isEmpty = Object.keys(responseBody).length === 0;
        return isEmpty

    }


};