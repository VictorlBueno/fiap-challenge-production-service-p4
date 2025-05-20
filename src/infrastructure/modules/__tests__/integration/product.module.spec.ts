import { Test, TestingModule } from '@nestjs/testing';
import { ProductModule } from '@/infrastructure/modules/product.module';
import { UpdateProductUsecase } from '@/application/usecases/products/update-product.usecase';
import { DeleteProductUsecase } from '@/application/usecases/products/delete-product.usecase';
import { GetProductsByCategoryUseCase } from '@/application/usecases/products/get-products-by-category.usecase';
import { UuidGenerator } from '@/infrastructure/providers/uuid-generator';
import { ProductCategoryEnum } from '@/domain/enums/category.enum';
import {CreateProductUseCase} from "@/application/usecases/products/create-product.usecase";
import {ProductEntity} from "@/domain/entities/product.entity";

describe('ProductModule Integration Test (BDD)', () => {
    let moduleRef: TestingModule;
    let createProductUC: CreateProductUseCase.UseCase;
    let updateProductUC: UpdateProductUsecase.UseCase;
    let deleteProductUC: DeleteProductUsecase.UseCase;
    let getByCategoryUC: GetProductsByCategoryUseCase.UseCase;
    let uuidGenerator: UuidGenerator;

    const productRepositoryMock = {
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        listByCategory: jest.fn(),
        findById: jest.fn(),
    };

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [ProductModule],
        })
            .overrideProvider('ProductRepository')
            .useValue(productRepositoryMock)
            .overrideProvider('UuidGenerator')
            .useValue({
                generate: jest.fn().mockReturnValue('fake-uuid'),
            })
            .compile();

        createProductUC = moduleRef.get(CreateProductUseCase.UseCase);
        updateProductUC = moduleRef.get(UpdateProductUsecase.UseCase);
        deleteProductUC = moduleRef.get(DeleteProductUsecase.UseCase);
        getByCategoryUC = moduleRef.get(GetProductsByCategoryUseCase.UseCase);
        uuidGenerator = moduleRef.get('UuidGenerator');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Given CreateProductUseCase, When executed, Then it creates a product and returns it', async () => {
        const input = {
            name: 'Product 1',
            description: 'A product description',
            price: 100,
            category: ProductCategoryEnum.BURGER,
        };
        const fakeProduct = { id: 'fake-uuid', ...input };

        productRepositoryMock.insert.mockResolvedValue(fakeProduct);

        const result = await createProductUC.execute(input);

        expect(productRepositoryMock.insert).toHaveBeenCalledWith(expect.objectContaining({
            id: 'fake-uuid',
            name: input.name,
            description: input.description,
            price: input.price,
            category: input.category,
        }));
        expect(result).toEqual(fakeProduct);
    });


    it('Given UpdateProductUsecase, When executed, Then it updates the product', async () => {
        const input = {
            id: 'fake-uuid',
            name: 'Updated Product',
            description: 'Updated description',
            price: 150,
            category: ProductCategoryEnum.BURGER,
        };

        const existingProduct = new ProductEntity({
            id: input.id,
            name: 'Old Product',
            description: 'Old description',
            price: 100,
            category: ProductCategoryEnum.BURGER,
        });

        productRepositoryMock.findById.mockResolvedValue(existingProduct);

        productRepositoryMock.update.mockImplementation(async (entity) => entity);

        const result = await updateProductUC.execute(input);

        expect(productRepositoryMock.findById).toHaveBeenCalledWith(input.id);
        expect(productRepositoryMock.update).toHaveBeenCalledWith(expect.any(ProductEntity));
        expect(result).toEqual(existingProduct.toJSON()); // já atualizado após entity.update()
    });

    it('Given DeleteProductUsecase, When executed, Then it deletes the product', async () => {
        const productId = 'fake-uuid';

        productRepositoryMock.delete.mockResolvedValue(undefined);

        const result = await deleteProductUC.execute({ id: productId });

        expect(productRepositoryMock.delete).toHaveBeenCalledWith("fake-uuid");
        expect(result).toBeUndefined();
    });

    it('Given GetProductsByCategoryUseCase, When executed, Then it returns products of the category', async () => {
        const categoryId = ProductCategoryEnum.PIZZA;

        const products = [
            new ProductEntity({ id: 'prod-1', name: 'Product 1', category: categoryId, price: 50, description: 'desc 1' }),
            new ProductEntity({ id: 'prod-2', name: 'Product 2', category: categoryId, price: 70, description: 'desc 2' }),
        ];

        productRepositoryMock.listByCategory.mockResolvedValue(products);

        const result = await getByCategoryUC.execute({ categoryId });

        expect(productRepositoryMock.listByCategory).toHaveBeenCalledWith(categoryId);
        expect(result).toEqual(products.map(p => p.toJSON()));
    });
});
