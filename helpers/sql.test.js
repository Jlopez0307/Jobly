const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require('./sql');

let testCompany = {
    handle: "test-company",
    name: "Company_to_test",
    num_employees: 100,
    description: "A company to test partial updates",
    logo_url: 'https://unsplash.com/photos/-p-KCm6xB9I'
}

describe(' sqlForPartalUpdate ', () => {
    test(' Succesfull columns and values created ', async () => {
        expect(sqlForPartialUpdate(testCompany, {}).toEqual({
            setCols: '"handle"=$1, "name"=$2, "num_employees"=$3, "description"=$4, "logo_url"=$5',
            values: [
                'test-company',
                'Company_to_test',
                100,
                'A company to test partial updates',
                'https://unsplash.com/photos/-p-KCm6xB9I'
              ]
        }));
    });
})