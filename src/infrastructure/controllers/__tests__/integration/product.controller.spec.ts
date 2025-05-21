import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { ProductController } from '@/infrastructure/controllers/product.controller';
import { CreateProductUseCase } from '@/application/usecases/products/create-product.usecase';
import { DeleteProductUsecase } from '@/application/usecases/products/delete-product.usecase';
import { GetProductsByCategoryUseCase } from '@/application/usecases/products/get-products-by-category.usecase';
import { ProductCategoryEnum } from '@/domain/enums/category.enum';

describe('ProductController (integration)', () => {
    let app: INestApplication;

    // Mock UseCases
    const createProductUseCase = { execute: jest.fn() };
    const updateProductUseCase = { execute: jest.fn() };
    const deleteProductUseCase = { execute: jest.fn() };
    const getProductByCategoryUseCase = { execute: jest.fn() };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                { provide: CreateProductUseCase.UseCase, useValue: createProductUseCase },
                { provide: DeleteProductUsecase.UseCase, useValue: deleteProductUseCase },
                { provide: GetProductsByCategoryUseCase.UseCase, useValue: getProductByCategoryUseCase },
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /products - create()', () => {
        it('should create a new product and return it', async () => {
            const createDto = {
                name: 'Burger',
                price: 9.99,
                description: 'Tasty burger',
                category: ProductCategoryEnum.BURGER,
            };

            const createdProduct = {
                id: 'uuid-123',
                ...createDto,
            };

            createProductUseCase.execute.mockResolvedValue(createdProduct);

            const response = await request(app.getHttpServer())
                .post('/products')
                .send(createDto)
                .expect(HttpStatus.CREATED);

            expect(createProductUseCase.execute).toHaveBeenCalledWith(createDto);
            expect(response.body).toEqual(createdProduct);
        });
    });

    describe('DELETE /products/:id - remove()', () => {
        it('should delete a product and return 204', async () => {
            const id = 'uuid-123';

            deleteProductUseCase.execute.mockResolvedValue(undefined);

            await request(app.getHttpServer())
                .delete(`/products/${id}`)
                .expect(HttpStatus.NO_CONTENT);

            expect(deleteProductUseCase.execute).toHaveBeenCalledWith({ id });
        });
    });

    describe('GET /products/category/:categoryId - listByCategory()', () => {
        it('should return products by category', async () => {
            const categoryId = ProductCategoryEnum.BURGER;

            const products = [
                {
                    id: 'uuid-1',
                    name: 'Burger',
                    price: 9.99,
                    description: 'Tasty burger',
                    category: categoryId,
                },
            ];

            getProductByCategoryUseCase.execute.mockResolvedValue(products);

            const response = await request(app.getHttpServer())
                .get(`/products/category/${categoryId}`)
                .expect(HttpStatus.OK);

            expect(getProductByCategoryUseCase.execute).toHaveBeenCalledWith({ categoryId });
            expect(response.body).toEqual(products);
        });
    });
});
