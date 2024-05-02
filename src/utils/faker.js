import { Faker, es, en } from '@faker-js/faker';

const faker = new Faker({
    locale: [es, en]
});

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        code: faker.string.alphanumeric({length: 10}).toUpperCase(),
        description: faker.lorem.paragraph(),
        price: faker.commerce.price(),
        category: faker.commerce.department(),
        stock: faker.number.int({min: 0, max: 100}),
        id: faker.database.mongodbObjectId(),
        thumbnail: faker.image.url(),
        status: faker.datatype.boolean()
    }
}