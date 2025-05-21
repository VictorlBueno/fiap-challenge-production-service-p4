import { ProductModelMapper } from '@/infrastructure/repositories/prisma/models/product-model.mapper';
import { ProductEntity } from '@/domain/entities/product.entity';
import { ProductCategoryEnum } from '@/domain/enums/category.enum';

describe('ProductModelMapper', () => {
    describe('toEntity', () => {
        it('should map a Prisma Product model to ProductEntity correctly', () => {
            // Given
            const productModel = {
                id: 'prod-123',
                name: 'Hamburger',
                description: 'Delicious hamburger',
                price: '15.99',
                category: 'BURGER',
            };

            // When
            const result = ProductModelMapper.toEntity(productModel as any);

            // Then
            expect(result).toBeInstanceOf(ProductEntity);
            expect(result).toEqual(expect.objectContaining({
                id: 'prod-123',
                name: 'Hamburger',
                description: 'Delicious hamburger',
                price: 15.99,
                category: ProductCategoryEnum.BURGER,
            }));
        });
    });
});
