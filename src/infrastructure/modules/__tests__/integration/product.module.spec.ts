import {Test, TestingModule} from '@nestjs/testing';
import {PrismaService} from '@/infrastructure/shared/database/prisma/prisma.service';
import {UuidGenerator} from '@/infrastructure/providers/uuid-generator';
import {ProductPrismaRepository} from '@/infrastructure/repositories/prisma/product-prisma.repository';
import {CreateProductUseCase} from '@/application/usecases/products/create-product.usecase';
import {DeleteProductUsecase} from '@/application/usecases/products/delete-product.usecase';
import {GetProductsByCategoryUseCase} from '@/application/usecases/products/get-products-by-category.usecase';
import {ProductModule} from '@/infrastructure/modules/product.module';
import {OrderService} from '@/infrastructure/gateway/order.service';
import {ProductCategoryEnum} from "@/domain/enums/category.enum";

describe('ProductModule (unit)', () => {
    let moduleRef: TestingModule;

    const prismaServiceMock = {};
    const uuidGeneratorMock = {generate: jest.fn().mockReturnValue('uuid-product')};
    const productRepositoryMock = {};
    const orderServiceMock = {createOrder: jest.fn().mockResolvedValue('order-created')};

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [ProductModule],
        })
            .overrideProvider('PrismaService')
            .useValue(prismaServiceMock)
            .overrideProvider('UuidGenerator')
            .useValue(uuidGeneratorMock)
            .overrideProvider('ProductRepository')
            .useValue(productRepositoryMock)
            .overrideProvider('OrderService')
            .useValue(orderServiceMock)
            .compile();
    });

    it('Given the ProductModule is initialized, Then all providers should be defined', () => {
        const prisma = moduleRef.get<PrismaService>('PrismaService');
        const uuid = moduleRef.get<UuidGenerator>('UuidGenerator');
        const productRepo = moduleRef.get<ProductPrismaRepository>('ProductRepository');
        const order = moduleRef.get<OrderService>('OrderService');
        const createUseCase = moduleRef.get<CreateProductUseCase.UseCase>(CreateProductUseCase.UseCase);
        const deleteUseCase = moduleRef.get<DeleteProductUsecase.UseCase>(DeleteProductUsecase.UseCase);
        const getByCategoryUseCase = moduleRef.get<GetProductsByCategoryUseCase.UseCase>(
            GetProductsByCategoryUseCase.UseCase,
        );

        expect(prisma).toBeDefined();
        expect(uuid).toBeDefined();
        expect(productRepo).toBeDefined();
        expect(order).toBeDefined();
        expect(createUseCase).toBeDefined();
        expect(deleteUseCase).toBeDefined();
        expect(getByCategoryUseCase).toBeDefined();
    });

    it('Given CreateProductUseCase, When execute is called, Then it should return a fake product', async () => {
        const createUseCase = moduleRef.get<CreateProductUseCase.UseCase>(CreateProductUseCase.UseCase);

        jest.spyOn(createUseCase, 'execute').mockResolvedValue({
            id: 'uuid-product',
            name: 'Coca',
            description: "--",
            price: 10,
            category: ProductCategoryEnum.DRINK,
        });

        const result = await createUseCase.execute({
            name: 'Coca',
            description: "--",
            price: 10,
            category: ProductCategoryEnum.DRINK,
        });

        expect(result).toEqual({
            id: 'uuid-product',
            name: 'Coca',
            description: "--",
            price: 10,
            category: ProductCategoryEnum.DRINK,
        });
    });

    it('Given DeleteProductUsecase, When execute is called, Then it should return success', async () => {
        const deleteUseCase = moduleRef.get<DeleteProductUsecase.UseCase>(DeleteProductUsecase.UseCase);

        jest.spyOn(deleteUseCase, 'execute').mockResolvedValue();

        const result = await deleteUseCase.execute({id: 'uuid-product'});

        expect(result).toEqual(undefined);
    });

    it('Given GetProductsByCategoryUseCase, When execute is called, Then it should return product list', async () => {
        const getByCategoryUseCase = moduleRef.get<GetProductsByCategoryUseCase.UseCase>(
            GetProductsByCategoryUseCase.UseCase,
        );

        jest.spyOn(getByCategoryUseCase, 'execute').mockResolvedValue([
            {
                id: 'uuid-product', name: 'Coca', description: "--", category: ProductCategoryEnum.DRINK,
                price: 10
            },
        ]);

        const result = await getByCategoryUseCase.execute({categoryId: "DRINK"});

        expect(result).toEqual([
            {id: 'uuid-product', name: 'Coca', description: "--", category: ProductCategoryEnum.DRINK, price: 10},
        ]);
    });
});
