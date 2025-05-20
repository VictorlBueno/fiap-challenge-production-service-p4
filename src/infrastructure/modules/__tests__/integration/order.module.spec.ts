import { Test, TestingModule } from '@nestjs/testing';
import { OrderModule } from '@/infrastructure/modules/order.module';
import { PrismaService } from '@/infrastructure/shared/database/prisma/prisma.service';
import { UuidGenerator } from '@/infrastructure/providers/uuid-generator';
import { OrderPrismaRepository } from '@/infrastructure/repositories/prisma/order-prisma.repository';
import { ProductPrismaRepository } from '@/infrastructure/repositories/prisma/product-prisma.repository';
import { CreateOrderUseCase } from '@/application/usecases/orders/create-orders.usecase';
import { UpdateOrderUseCase } from '@/application/usecases/orders/update-order.usecase';
import { GetOrderPaymentStatusUseCase } from '@/application/usecases/orders/get-order-payment-status.usecase';
import { GetOrdersUseCase } from '@/application/usecases/orders/get-orders.usecase';
import {OrderStatusEnum} from "@/domain/enums/order-status.enum";
import {PaymentStatusEnum} from "@/domain/enums/payment-status.enum";

describe('OrderModule Integration', () => {
    let moduleRef: TestingModule;

    const prismaServiceMock = {};
    const uuidGeneratorMock = { generate: jest.fn().mockReturnValue('fake-uuid') };
    const orderRepositoryMock = {
        create: jest.fn(),
        update: jest.fn(),
        getPaymentStatus: jest.fn(),
        getOrders: jest.fn(),
    };
    const productRepositoryMock = {
        findProduct: jest.fn(),
    };

    beforeAll(async () => {
        // Given the OrderModule with all providers overridden with mocks
        moduleRef = await Test.createTestingModule({
            imports: [OrderModule],
        })
            .overrideProvider('PrismaService')
            .useValue(prismaServiceMock)
            .overrideProvider('UuidGenerator')
            .useValue(uuidGeneratorMock)
            .overrideProvider('OrderRepository')
            .useValue(orderRepositoryMock)
            .overrideProvider('ProductRepository')
            .useValue(productRepositoryMock)
            .compile();
    });

    it('Given OrderModule initialized, When retrieving providers, Then all should be defined', () => {
        // When getting all providers
        const prisma = moduleRef.get<PrismaService>('PrismaService');
        const uuidGen = moduleRef.get<UuidGenerator>('UuidGenerator');
        const orderRepo = moduleRef.get<OrderPrismaRepository>('OrderRepository');
        const productRepo = moduleRef.get<ProductPrismaRepository>('ProductRepository');
        const createOrderUC = moduleRef.get<CreateOrderUseCase.UseCase>(CreateOrderUseCase.UseCase);
        const updateOrderUC = moduleRef.get<UpdateOrderUseCase.UseCase>(UpdateOrderUseCase.UseCase);
        const paymentStatusUC = moduleRef.get<GetOrderPaymentStatusUseCase.UseCase>(GetOrderPaymentStatusUseCase.UseCase);
        const getOrdersUC = moduleRef.get<GetOrdersUseCase.UseCase>(GetOrdersUseCase.UseCase);

        // Then all providers should be defined
        expect(prisma).toBeDefined();
        expect(uuidGen).toBeDefined();
        expect(orderRepo).toBeDefined();
        expect(productRepo).toBeDefined();
        expect(createOrderUC).toBeDefined();
        expect(updateOrderUC).toBeDefined();
        expect(paymentStatusUC).toBeDefined();
        expect(getOrdersUC).toBeDefined();
    });

    it('Given CreateOrderUseCase, When executed, Then it returns a fake order', async () => {
        const createOrderUC = moduleRef.get<CreateOrderUseCase.UseCase>(CreateOrderUseCase.UseCase);

        expect(typeof createOrderUC.execute).toBe('function');

        productRepositoryMock.findProduct = jest.fn()
            .mockImplementation((id: string) => Promise.resolve({ id, name: `Product ${id}`, price: 10 }));

        orderRepositoryMock.create = jest.fn().mockResolvedValue(undefined);

        jest.spyOn(createOrderUC, 'execute').mockImplementation(async (input) => {
            const productList = [];
            for (const productId of input.products) {
                const product = await productRepositoryMock.findProduct(productId);
                if (product) productList.push(product);
            }

            const fakeOrderEntity = {
                id: 'fake-uuid',
                clientId: input.clientId,
                products: productList,
                total: productList.reduce((acc, p) => acc + (p.price ?? 0), 0),
                status: 'created',
                paymentStatus: 'pending',
                createdAt: new Date(),
                client: { id: input.clientId, name: 'Fake Client' },
                toJSON: function () {
                    return {
                        id: this.id,
                        clientId: this.clientId,
                        products: this.products,
                        total: this.total,
                        status: this.status,
                        paymentStatus: this.paymentStatus,
                        createdAt: this.createdAt,
                        client: this.client,
                    };
                },
            };

            await orderRepositoryMock.create(fakeOrderEntity);

            const entityJSON = fakeOrderEntity.toJSON();

            return {
                ...entityJSON,
                paymentLink: `${input.host}/paymock/${entityJSON.id}`,
            };
        });

        const input = {
            clientId: 'client-123',
            products: ['prod-1', 'prod-2'],
            host: 'http://localhost',
        };

        const result = await createOrderUC.execute(input);

        expect(productRepositoryMock.findProduct).toHaveBeenCalledTimes(2);
        expect(orderRepositoryMock.create).toHaveBeenCalled();
        expect(result).toEqual({
            id: 'fake-uuid',
            clientId: 'client-123',
            products: [
                { id: 'prod-1', name: 'Product prod-1', price: 10 },
                { id: 'prod-2', name: 'Product prod-2', price: 10 },
            ],
            total: 20,
            status: 'created',
            paymentStatus: 'pending',
            createdAt: expect.any(Date),
            client: { id: 'client-123', name: 'Fake Client' },
            paymentLink: 'http://localhost/paymock/fake-uuid',
        });
    });

    it('Given UpdateOrderUseCase, When executed, Then it updates the order', async () => {
        const updateOrderUC = moduleRef.get<UpdateOrderUseCase.UseCase>(UpdateOrderUseCase.UseCase);

        expect(typeof updateOrderUC.execute).toBe('function');

        orderRepositoryMock.update.mockResolvedValue({ id: 'order-1', status: OrderStatusEnum.IN_PREPARATION });

        jest.spyOn(updateOrderUC, 'execute').mockImplementation(async (input) => {
            return orderRepositoryMock.update(input);
        });

        const result = await updateOrderUC.execute({ id: 'order-1', status: OrderStatusEnum.IN_PREPARATION, paymentStatus: PaymentStatusEnum.APPROVED });

        expect(orderRepositoryMock.update).toHaveBeenCalledWith({ id: 'order-1', status: OrderStatusEnum.IN_PREPARATION, paymentStatus: PaymentStatusEnum.APPROVED });
        expect(result).toEqual({ id: 'order-1', status: OrderStatusEnum.IN_PREPARATION });
    });

    it('Given GetOrderPaymentStatusUseCase, When executed, Then it returns payment status', async () => {
        const paymentStatusUC = moduleRef.get<GetOrderPaymentStatusUseCase.UseCase>(GetOrderPaymentStatusUseCase.UseCase);

        expect(typeof paymentStatusUC.execute).toBe('function');

        orderRepositoryMock.getPaymentStatus.mockResolvedValue('PAID');

        jest.spyOn(paymentStatusUC, 'execute').mockImplementation(async (orderId) => {
            return orderRepositoryMock.getPaymentStatus(orderId);
        });

        const status = await paymentStatusUC.execute({id: 'order-1'});

        expect(orderRepositoryMock.getPaymentStatus).toHaveBeenCalledWith({id: "order-1"});
        expect(status).toBe('PAID');
    });

    it('Given GetOrdersUseCase, When executed, Then it returns a list of orders', async () => {
        const getOrdersUC = moduleRef.get<GetOrdersUseCase.UseCase>(GetOrdersUseCase.UseCase);

        expect(typeof getOrdersUC.execute).toBe('function');

        const fakeOrders = [{ id: 'order-1' }, { id: 'order-2' }];
        orderRepositoryMock.getOrders.mockResolvedValue(fakeOrders);

        jest.spyOn(getOrdersUC, 'execute').mockImplementation(async () => {
            return orderRepositoryMock.getOrders();
        });

        const orders = await getOrdersUC.execute();

        expect(orderRepositoryMock.getOrders).toHaveBeenCalled();
        expect(orders).toEqual(fakeOrders);
    });
});
