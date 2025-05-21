import { OrderModelMapper } from '@/infrastructure/repositories/prisma/models/order-model.mapper';
import { OrderEntity } from '@/domain/entities/order.entity';
import { ClientModelMapper } from '@/infrastructure/repositories/prisma/models/client-model.mapper';
import { OrderStatusEnum } from '@/domain/enums/order-status.enum';
import { PaymentStatusEnum } from '@/domain/enums/payment-status.enum';

jest.mock('@/infrastructure/repositories/prisma/models/client-model.mapper', () => ({
    ClientModelMapper: {
        toEntity: jest.fn(),
    },
}));

describe('OrderModelMapper', () => {
    describe('toEntity', () => {
        it('should map an Order model to OrderEntity correctly', () => {
            // Given
            const mockClientEntity = { id: 'client-1', name: 'Client 1' };
            (ClientModelMapper.toEntity as jest.Mock).mockReturnValue(mockClientEntity);

            const orderModel = {
                id: 'order-1',
                clientId: 'client-1',
                status: 'RECEIVED',
                paymentStatus: 'PENDING',
                total: '100.50',
                products: [{ productId: 'p1', quantity: 2 }],
                client: { id: 'client-1', name: 'Client 1', cpf: '12345678900' },
            };

            // When
            const result = OrderModelMapper.toEntity(orderModel as any);

            // Then
            expect(result).toBeInstanceOf(OrderEntity);
            expect(ClientModelMapper.toEntity).toHaveBeenCalledWith(orderModel.client);
        });
    });

    describe('paymentStatusToEntity', () => {
        it('should map payment status correctly', () => {
            // Given
            const paymentModel = {
                id: 'order-1',
                paymentStatus: 'APPROVED',
            };

            // When
            const result = OrderModelMapper.paymentStatusToEntity(paymentModel);

            // Then
            expect(result).toEqual({
                id: 'order-1',
                paymentStatus: PaymentStatusEnum.APPROVED,
            });
        });
    });
});
