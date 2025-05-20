import { ProductCategoryEnum } from '@/domain/enums/category.enum';
import {ProductEntity} from "@/domain/entities/product.entity";

describe('ProductEntity', () => {
    const initialProps = {
        id: 'prod-001',
        name: 'Cheeseburger',
        description: 'Delicious grilled burger with cheese',
        price: 12.5,
        category: ProductCategoryEnum.DRINK,
    };

    describe('when a product is created', () => {
        it('should have the correct properties', () => {
            const product = new ProductEntity(initialProps);

            expect(product.id).toBe('prod-001');
            expect(product.name).toBe('Cheeseburger');
            expect(product.description).toBe('Delicious grilled burger with cheese');
            expect(product.price).toBe(12.5);
            expect(product.category).toBe(ProductCategoryEnum.DRINK);
        });
    });

    describe('when update is called with partial properties', () => {
        it('should update only the provided fields', async () => {
            const product = new ProductEntity(initialProps);

            await product.update({
                name: 'Veggie Burger',
                price: 10,
            });

            expect(product.name).toBe('Veggie Burger');
            expect(product.price).toBe(10);
            expect(product.description).toBe(initialProps.description); // unchanged
            expect(product.category).toBe(initialProps.category);       // unchanged
        });

        it('should update all fields if all are provided', async () => {
            const updatedProps = {
                name: 'Coca-Cola',
                description: 'Refreshing soda',
                price: 5.5,
                category: ProductCategoryEnum.DRINK,
            };

            const product = new ProductEntity(initialProps);
            await product.update(updatedProps);

            expect(product.name).toBe(updatedProps.name);
            expect(product.description).toBe(updatedProps.description);
            expect(product.price).toBe(updatedProps.price);
            expect(product.category).toBe(updatedProps.category);
        });

        it('should not change anything if no properties are provided', async () => {
            const product = new ProductEntity(initialProps);

            await product.update({});

            expect(product.name).toBe(initialProps.name);
            expect(product.description).toBe(initialProps.description);
            expect(product.price).toBe(initialProps.price);
            expect(product.category).toBe(initialProps.category);
        });
    });
});
