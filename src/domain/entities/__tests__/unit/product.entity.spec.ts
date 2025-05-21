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

            expect(product.name).toBe('Cheeseburger');
            expect(product.price).toBe(12.5);
            expect(product.description).toBe(initialProps.description);
            expect(product.category).toBe(initialProps.category);
        });

        it('should not change anything if no properties are provided', async () => {
            const product = new ProductEntity(initialProps);

            expect(product.name).toBe(initialProps.name);
            expect(product.description).toBe(initialProps.description);
            expect(product.price).toBe(initialProps.price);
            expect(product.category).toBe(initialProps.category);
        });
    });
});
