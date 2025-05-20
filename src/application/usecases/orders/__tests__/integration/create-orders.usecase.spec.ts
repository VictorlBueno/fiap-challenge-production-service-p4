import { BadRequestError } from '@/application/shared/errors/bad-request-error';
import { IOrderRepository } from '@/domain/repositories/order.repository';
import { IProductRepository } from '@/domain/repositories/product.repository';
import { ProductEntity } from '@/domain/entities/product.entity';
import { ProductCategoryEnum } from '@/domain/enums/category.enum';
import { UuidGenerator } from '@/infrastructure/providers/uuid-generator';
import { OrderEntity } from '@/domain/entities/order.entity';
import {CreateOrderUseCase} from "@/application/usecases/orders/create-orders.usecase";

describe('CreateOrderUseCase', () => {
    let orderRepository: IOrderRepository;
    let productRepository: IProductRepository;
    let uuidGenerator: UuidGenerator;
    let useCase: CreateOrderUseCase.UseCase;

    beforeEach(() => {
        orderRepository = {
            insert: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getPaymentStatus: jest.fn(),
        };

        productRepository = {
            findById: jest.fn(),
            findAll: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            listByCategory: jest.fn(),
        };

        uuidGenerator = {
            generate: jest.fn().mockReturnValue('uuid-1234'),
        };

        useCase = new CreateOrderUseCase.UseCase(orderRepository, productRepository, uuidGenerator);
    });

    describe('when input is invalid', () => {
        it('should throw BadRequestError if clientId is missing', async () => {
            await expect(
                useCase.execute({ clientId: '', products: [], host: 'http://localhost' })
            ).rejects.toThrow(BadRequestError);
        });

        it('should throw BadRequestError if products list is empty', async () => {
            await expect(
                useCase.execute({ clientId: 'client-1', products: [], host: 'http://localhost' })
            ).rejects.toThrow(BadRequestError);
        });
    });

    describe('when input is valid', () => {
        it('should create an order and return expected output', async () => {
            const input: CreateOrderUseCase.Input = {
                clientId: 'client-1',
                products: ['prod-1', 'prod-2'],
                host: 'http://localhost',
            };

            const mockProducts = [
                new ProductEntity({
                    id: 'prod-1',
                    name: 'Burger',
                    description: 'Delicious burger',
                    price: 20,
                    category: ProductCategoryEnum.BURGER,
                }),
                new ProductEntity({
                    id: 'prod-2',
                    name: 'Soda',
                    description: 'Refreshing drink',
                    price: 5,
                    category: ProductCategoryEnum.DRINK,
                }),
            ];

            (productRepository.findById as jest.Mock)
                .mockResolvedValueOnce(mockProducts[0])
                .mockResolvedValueOnce(mockProducts[1]);

            (orderRepository.insert as jest.Mock).mockResolvedValue(undefined);

            const output = await useCase.execute(input);

            expect(productRepository.findById).toHaveBeenCalledTimes(2);
            expect(orderRepository.insert).toHaveBeenCalledWith(expect.any(OrderEntity));
            expect(output.id).toBe('uuid-1234');
            expect(output.products).toHaveLength(2);
            expect(output.clientId).toBe('client-1');
            expect(output.paymentLink).toBe('http://localhost/paymock/uuid-1234');
        });

        it('should ignore invalid product IDs', async () => {
            const input: CreateOrderUseCase.Input = {
                clientId: 'client-1',
                products: ['valid-id', 'invalid-id'],
                host: 'http://localhost',
            };

            const validProduct = new ProductEntity({
                id: 'valid-id',
                name: 'Pizza',
                description: 'Cheesy pizza',
                price: 30,
                category: ProductCategoryEnum.BURGER,
            });

            (productRepository.findById as jest.Mock)
                .mockResolvedValueOnce(validProduct)
                .mockResolvedValueOnce(null); // invalid product

            (orderRepository.insert as jest.Mock).mockResolvedValue(undefined);

            const output = await useCase.execute(input);

            expect(output.products).toHaveLength(1);
            expect(output.products[0].id).toBe('valid-id');
        });
    });
});
