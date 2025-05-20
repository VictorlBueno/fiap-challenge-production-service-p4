import { IOrderRepository } from '@/domain/repositories/order.repository';
import { BadRequestError } from '@/application/shared/errors/bad-request-error';
import { PaymentStatusEnum } from '@/domain/enums/payment-status.enum';
import { OrderEntity } from '@/domain/entities/order.entity';
import {GetOrderPaymentStatusUseCase} from "@/application/usecases/orders/get-order-payment-status.usecase";

describe('GetOrderPaymentStatusUseCase', () => {
    let orderRepository: IOrderRepository;
    let useCase: GetOrderPaymentStatusUseCase.UseCase;

    beforeEach(() => {
        orderRepository = {
            findById: jest.fn(),
            insert: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getPaymentStatus: jest.fn(),
        };

        useCase = new GetOrderPaymentStatusUseCase.UseCase(orderRepository);
    });

    describe('when input is invalid', () => {
        it('should throw BadRequestError if id is missing', async () => {
            await expect(useCase.execute({ id: '' })).rejects.toThrow(BadRequestError);
            await expect(useCase.execute({ id: '' })).rejects.toThrow('Order id not provided');
        });
    });

    describe('when order exists', () => {
        it('should return order payment status correctly', async () => {
            const mockOrder = new OrderEntity({
                id: 'order-123',
                clientId: 'client-1',
                products: [],
                paymentStatus: PaymentStatusEnum.APPROVED,
            });

            mockOrder.toJSON = jest.fn().mockReturnValue({
                id: 'order-123',
                paymentStatus: PaymentStatusEnum.APPROVED,
            });

            (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

            const output = await useCase.execute({ id: 'order-123' });

            expect(orderRepository.findById).toHaveBeenCalledWith('order-123');
            expect(output).toEqual({
                id: 'order-123',
                paymentStatus: PaymentStatusEnum.APPROVED,
            });
        });
    });

    describe('when order does not exist', () => {
        it('should throw BadRequestError if order is not found', async () => {
            (orderRepository.findById as jest.Mock).mockResolvedValue(null);

            await expect(useCase.execute({ id: 'not-found' })).rejects.toThrow(BadRequestError);
            await expect(useCase.execute({ id: 'not-found' })).rejects.toThrow('Order not found');
        });
    });
});
