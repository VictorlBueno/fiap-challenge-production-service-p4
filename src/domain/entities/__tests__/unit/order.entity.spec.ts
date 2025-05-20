import {OrderEntity, OrderProps} from "@/domain/entities/order.entity";
import {OrderStatusEnum} from "@/domain/enums/order-status.enum";
import {PaymentStatusEnum} from "@/domain/enums/payment-status.enum";
import {ProductCategoryEnum} from "@/domain/enums/category.enum";

describe('OrderEntity', () => {
    const baseProps: OrderProps = {
        id: 'order-001',
        clientId: 'client-123',
        products: [
            { id: 'prod-1', name: 'Pizza', description: 'Delicious', price: 10, category: ProductCategoryEnum.PIZZA },
            { id: 'prod-2', name: 'Soda', description: 'Cold drink', price: 5, category: ProductCategoryEnum.DRINK },
        ],
    };

    describe('when a new OrderEntity is created', () => {
        it('should initialize with default status and paymentStatus and calculate total', () => {
            const order = new OrderEntity(baseProps);

            expect(order.id).toBe(baseProps.id);
            expect(order.clientId).toBe(baseProps.clientId);
            expect(order.status).toBe(OrderStatusEnum.RECEIVED); // default
            expect(order.paymentStatus).toBe(PaymentStatusEnum.PENDING); // default
            expect(order.total).toBe(15); // 10 + 5
            expect(order.createdAt).toBeInstanceOf(Date);
        });

        it('should use provided status, paymentStatus and total if given', () => {
            const propsWithOverrides: OrderProps = {
                ...baseProps,
                status: OrderStatusEnum.READY,
                paymentStatus: PaymentStatusEnum.APPROVED,
                total: 100,
                createdAt: new Date(),
            };

            const order = new OrderEntity(propsWithOverrides);

            expect(order.status).toBe(OrderStatusEnum.READY);
            expect(order.paymentStatus).toBe(PaymentStatusEnum.APPROVED);
            expect(order.total).toBe(100);
        });
    });

    describe('getters and setters', () => {
        it('should get properties correctly', () => {
            const order = new OrderEntity(baseProps);
            expect(order.id).toBe(baseProps.id);
            expect(order.clientId).toBe(baseProps.clientId);
            expect(order.total).toBe(15);
            expect(order.status).toBe(OrderStatusEnum.RECEIVED);
            expect(order.paymentStatus).toBe(PaymentStatusEnum.PENDING);
            expect(order.createdAt).toBeInstanceOf(Date);
        });

        // Private setters are not directly testáveis, mas são usados internamente
    });

    describe('when update() is called', () => {
        it('should update only provided properties and keep others unchanged', async () => {
            const order = new OrderEntity(baseProps);
            const updateData = {
                paymentStatus: PaymentStatusEnum.APPROVED,
                status: OrderStatusEnum.IN_PREPARATION,
                total: 20,
                clientId: 'client-456',
            };

            await order.update(updateData);

            expect(order.paymentStatus).toBe(PaymentStatusEnum.APPROVED);
            expect(order.status).toBe(OrderStatusEnum.IN_PREPARATION);
            expect(order.total).toBe(20);
            expect(order.clientId).toBe('client-456');
        });

        it('should keep existing values if update props are missing or undefined', async () => {
            const order = new OrderEntity(baseProps);
            const originalProps = {
                paymentStatus: order.paymentStatus,
                status: order.status,
                total: order.total,
                clientId: order.clientId,
            };

            await order.update({}); // empty update

            expect(order.paymentStatus).toBe(originalProps.paymentStatus);
            expect(order.status).toBe(originalProps.status);
            expect(order.total).toBe(originalProps.total);
            expect(order.clientId).toBe(originalProps.clientId);

            await order.update({
                paymentStatus: undefined,
                status: undefined,
                total: undefined,
                clientId: undefined,
            });

            expect(order.paymentStatus).toBe(originalProps.paymentStatus);
            expect(order.status).toBe(originalProps.status);
            expect(order.total).toBe(originalProps.total);
            expect(order.clientId).toBe(originalProps.clientId);
        });
    });
});
