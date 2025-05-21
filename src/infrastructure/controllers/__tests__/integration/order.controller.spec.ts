import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '@/infrastructure/controllers/order.controller';
import { CreateOrderUseCase } from '@/application/usecases/orders/create-orders.usecase';
import { UpdateOrderUseCase } from '@/application/usecases/orders/update-order.usecase';
import { GetOrderPaymentStatusUseCase } from '@/application/usecases/orders/get-order-payment-status.usecase';
import { GetOrdersUseCase } from '@/application/usecases/orders/get-orders.usecase';
import { NotFoundException } from '@nestjs/common';
import {OrderStatusEnum} from "@/domain/enums/order-status.enum";
import {PaymentStatusEnum} from "@/domain/enums/payment-status.enum";
import {ProductCategoryEnum} from "@/domain/enums/category.enum";

describe('OrderController - Integration', () => {
    let controller: OrderController;
    let createOrderUseCase: CreateOrderUseCase.UseCase;
    let updateOrderUseCase: UpdateOrderUseCase.UseCase;
    let getOrderPaymentStatusUseCase: GetOrderPaymentStatusUseCase.UseCase;
    let listOrdersUseCase: GetOrdersUseCase.UseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrderController],
            providers: [
                { provide: CreateOrderUseCase.UseCase, useValue: { execute: jest.fn() } },
                { provide: UpdateOrderUseCase.UseCase, useValue: { execute: jest.fn() } },
                { provide: GetOrderPaymentStatusUseCase.UseCase, useValue: { execute: jest.fn() } },
                { provide: GetOrdersUseCase.UseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<OrderController>(OrderController);
        createOrderUseCase = module.get<CreateOrderUseCase.UseCase>(CreateOrderUseCase.UseCase);
        updateOrderUseCase = module.get<UpdateOrderUseCase.UseCase>(UpdateOrderUseCase.UseCase);
        getOrderPaymentStatusUseCase = module.get<GetOrderPaymentStatusUseCase.UseCase>(GetOrderPaymentStatusUseCase.UseCase);
        listOrdersUseCase = module.get<GetOrdersUseCase.UseCase>(GetOrdersUseCase.UseCase);
    });

    describe('POST /orders - create()', () => {
        it('should create a new order with host info and return the result', async () => {
            // Given
            const dto: CreateOrderUseCase.Input = {
                clientId: 'client123',
                products: [{
                    id: "string",
                    name: "string",
                    price: 0,
                    description: "string",
                    category: ProductCategoryEnum.BURGER
                }],
            };

            jest.spyOn(createOrderUseCase, 'execute').mockResolvedValue({message: "Success!"});

            // When
            const result = await controller.create(dto);

            // Then
            expect(createOrderUseCase.execute).toHaveBeenCalledWith(dto);
            expect(result).toEqual({message: "Success!"});
        });
    });

    describe('GET /orders - search()', () => {
        it('should return a list of orders', async () => {
            const expectedOrders = [
                {
                    id: "123e4567-e89b-12d3-a456-426614174000",
                    clientId: "123e4567-e89b-12d3-a456-426614174000",
                    total: 49.99,
                    status: OrderStatusEnum.IN_PREPARATION,
                    paymentStatus: PaymentStatusEnum.APPROVED,
                    products: [
                        {
                            id: "string",
                            name: "string",
                            price: 0,
                            description: "string",
                            category: ProductCategoryEnum.BURGER
                        }
                    ],
                    createdAt: new Date("2024-01-21T10:30:00Z"),
                    client: {
                        id: "123e4567-e89b-12d3-a456-426614174000",
                        name: "John Doe",
                        cpf: "12345678900"
                    }
                }
            ];

            jest.spyOn(listOrdersUseCase, 'execute').mockResolvedValue(expectedOrders);

            const result = await controller.search();

            expect(listOrdersUseCase.execute).toHaveBeenCalled();
            expect(result).toEqual(expectedOrders);
        });
    });

    describe('GET /orders/:id - findOne()', () => {
        it('should return the payment status of the order when found', async () => {
            const id = 'order123';
            const expectedStatus = {
                id: "61ddbe0b-4259-4808-a12b-3f268a5db19c",
                clientId: "0478f478-f031-703d-8b18-fe7fd1f7da55",
                status: OrderStatusEnum.RECEIVED,
                paymentStatus: PaymentStatusEnum.PENDING,
                total: 15.99,
                products: [
                    {
                        orderId: "61ddbe0b-4259-4808-a12b-3f268a5db19c",
                        productId: "0b1cfe20-26c7-4e89-97d2-ee619a60fd77"
                    }
                ],
                client: {
                    id: "0478f478-f031-703d-8b18-fe7fd1f7da55",
                    name: "John Doe",
                    cpf: "37702232099"
                },
                createdAt: new Date()
            };

            jest.spyOn(getOrderPaymentStatusUseCase, 'execute').mockResolvedValue(expectedStatus);

            const result = await controller.findOne(id);

            expect(getOrderPaymentStatusUseCase.execute).toHaveBeenCalledWith({ id });
            expect(result).toEqual(expectedStatus);
        });

        it('should throw NotFoundException if order not found', async () => {
            const id = 'notfound';
            jest.spyOn(getOrderPaymentStatusUseCase, 'execute').mockRejectedValue(new NotFoundException('Order not found'));

            await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('PUT /orders/:id - update()', () => {
        it('should update order and return updated order', async () => {
            const id = 'order123';
            const updateDto = {
                id: "123e4567-e89b-12d3-a456-426614174000",
                paymentStatus: PaymentStatusEnum.APPROVED,
                status: OrderStatusEnum.IN_PREPARATION,
            };
            const expectedOrder = {
                id: "123e4567-e89b-12d3-a456-426614174000",
                clientId: "123e4567-e89b-12d3-a456-426614174000",
                total: 49.99,
                status: OrderStatusEnum.IN_PREPARATION,
                paymentStatus: PaymentStatusEnum.APPROVED,
                products: [
                    {
                        id: "string",
                        name: "string",
                        price: 0,
                        description: "string",
                        category: ProductCategoryEnum.BURGER,
                    }
                ],
                createdAt: new Date(),
                client: {
                    id: "123e4567-e89b-12d3-a456-426614174000",
                    name: "John Doe",
                    cpf: "12345678900",
                }
            };

            jest.spyOn(updateOrderUseCase, 'execute').mockResolvedValue(expectedOrder);

            const result = await controller.update(id, updateDto);

            expect(updateOrderUseCase.execute).toHaveBeenCalledWith({ id, ...updateDto });
            expect(result).toEqual(expectedOrder);
        });

        it('should throw NotFoundException if order to update is not found', async () => {
            const id = 'notfound';
            const updateDto = {
                id, // obrigatório
                paymentStatus: PaymentStatusEnum.APPROVED,
                status: OrderStatusEnum.READY,
            };

            jest.spyOn(updateOrderUseCase, 'execute').mockRejectedValue(new NotFoundException('Order not found'));

            await expect(controller.update(id, updateDto)).rejects.toThrow(NotFoundException);
        });
    });
});
