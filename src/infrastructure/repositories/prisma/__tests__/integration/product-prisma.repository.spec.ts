import { PrismaService } from '@/infrastructure/shared/database/prisma/prisma.service';
import { ProductModelMapper } from '@/infrastructure/repositories/prisma/models/product-model.mapper';
import {ProductPrismaRepository} from "@/infrastructure/repositories/prisma/product-prisma.repository";

describe('ProductPrismaRepository Integration', () => {
    let prismaService: PrismaService;
    let repository: ProductPrismaRepository;

    beforeEach(() => {
        prismaService = new PrismaService();

        jest.spyOn(prismaService.product, 'delete').mockResolvedValue(undefined as any);
        jest.spyOn(prismaService.product, 'findMany').mockResolvedValue([]);
        jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(null);
        jest.spyOn(prismaService.product, 'create').mockResolvedValue(undefined as any);
        jest.spyOn(prismaService.product, 'update').mockResolvedValue(undefined as any);

        jest.spyOn(ProductModelMapper, 'toEntity').mockImplementation(item => item as any);

        repository = new ProductPrismaRepository(prismaService);
    });

    describe('Given a ProductPrismaRepository', () => {
        it('When delete is called, Then it deletes a product by id', async () => {
            await repository.delete('product-id-123');
            expect(prismaService.product.delete).toHaveBeenCalledWith({ where: { id: 'product-id-123' } });
        });

        it('When findAll is called, Then it returns all products as entities', async () => {
            const fakeProducts = [{ id: 'prod-1', name: 'Product 1' }];
            (prismaService.product.findMany as jest.Mock).mockResolvedValue(fakeProducts);

            const result = await repository.findAll();

            expect(prismaService.product.findMany).toHaveBeenCalled();
            expect(ProductModelMapper.toEntity).toHaveBeenCalledTimes(fakeProducts.length);
            expect(result).toEqual(fakeProducts);
        });

        it('When findById is called, Then it returns a product entity or null', async () => {
            const fakeProduct = { id: 'prod-1', name: 'Product 1' };
            (prismaService.product.findUnique as jest.Mock).mockResolvedValue(fakeProduct);

            const result = await repository.findById('prod-1');

            expect(prismaService.product.findUnique).toHaveBeenCalledWith({ where: { id: 'prod-1' } });
            expect(ProductModelMapper.toEntity).toHaveBeenCalledWith(fakeProduct);
            expect(result).toEqual(fakeProduct);
        });

        it('When insert is called, Then it creates a new product', async () => {
            const fakeEntity = {
                props: {
                    id: 'prod-1',
                    name: 'Product 1',
                    description: 'desc',
                    price: 100,
                    category: 'category-1',
                },
            } as any;

            await repository.insert(fakeEntity);

            expect(prismaService.product.create).toHaveBeenCalledWith({
                data: {
                    id: fakeEntity.props.id,
                    name: fakeEntity.props.name,
                    description: fakeEntity.props.description,
                    price: fakeEntity.props.price,
                    category: fakeEntity.props.category,
                },
            });
        });

        it('When listByCategory is called, Then it returns products filtered by category', async () => {
            const categoryId = 'category-1';
            const fakeProducts = [{ id: 'prod-1', category: categoryId }];

            (prismaService.product.findMany as jest.Mock).mockResolvedValue(fakeProducts);
            (ProductModelMapper.toEntity as jest.Mock).mockClear();

            const result = await repository.listByCategory(categoryId);

            expect(prismaService.product.findMany).toHaveBeenCalledWith({
                where: { category: categoryId },
            });

            expect(ProductModelMapper.toEntity).toHaveBeenCalledTimes(fakeProducts.length);
            expect(result).toEqual(fakeProducts);
        });

        it('When update is called, Then it updates the product', async () => {
            const fakeEntity = {
                props: {
                    id: 'prod-1',
                    name: 'Updated Name',
                    description: 'Updated Desc',
                    price: 150,
                    category: 'category-1',
                },
            } as any;

            await repository.update(fakeEntity);

            expect(prismaService.product.update).toHaveBeenCalledWith({
                where: { id: fakeEntity.props.id },
                data: {
                    name: fakeEntity.props.name,
                    description: fakeEntity.props.description,
                    price: fakeEntity.props.price,
                    category: fakeEntity.props.category,
                },
            });
        });
    });
});
