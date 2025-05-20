import { BadRequestError } from "@/application/shared/errors/bad-request-error";
import { PaymentStatusEnum } from "@/domain/enums/payment-status.enum";
import { OrderStatusEnum } from "@/domain/enums/order-status.enum";
import {UpdateOrderUseCase} from "@/application/usecases/orders/update-order.usecase";

describe("UpdateOrderUseCase - Integration Test", () => {
    let useCase: UpdateOrderUseCase.UseCase;
    let orderRepositoryMock: any;
    let orderEntityMock: any;

    beforeEach(() => {
        orderEntityMock = {
            update: jest.fn(),
            toJSON: jest.fn(),
        };

        orderRepositoryMock = {
            findById: jest.fn(),
            update: jest.fn(),
        };

        useCase = new UpdateOrderUseCase.UseCase(orderRepositoryMock);
    });

    describe("execute()", () => {
        it("should throw BadRequestError if id is not provided", async () => {
            // Given
            const input = {
                id: "",
                paymentStatus: PaymentStatusEnum.APPROVED,
                status: OrderStatusEnum.READY,
            };

            // When & Then
            await expect(useCase.execute(input)).rejects.toThrow(BadRequestError);
            await expect(useCase.execute(input)).rejects.toThrow("Input data not provided");
        });

        it("should update the order and return updated data", async () => {
            // Given
            const input = {
                id: "order-123",
                paymentStatus: PaymentStatusEnum.APPROVED,
                status: OrderStatusEnum.READY,
            };

            orderRepositoryMock.findById.mockResolvedValue(orderEntityMock);
            orderEntityMock.update.mockResolvedValue(undefined);
            orderRepositoryMock.update.mockResolvedValue(undefined);
            orderEntityMock.toJSON.mockReturnValue({
                id: input.id,
                paymentStatus: input.paymentStatus,
                status: input.status,
            });

            // When
            const result = await useCase.execute(input);

            // Then
            expect(orderRepositoryMock.findById).toHaveBeenCalledWith(input.id);
            expect(orderEntityMock.update).toHaveBeenCalledWith(input);
            expect(orderRepositoryMock.update).toHaveBeenCalledWith(orderEntityMock);
            expect(orderEntityMock.toJSON).toHaveBeenCalled();
            expect(result).toEqual({
                id: input.id,
                paymentStatus: input.paymentStatus,
                status: input.status,
            });
        });

        it("should throw if order not found", async () => {
            // Given
            const input = {
                id: "nonexistent-id",
                paymentStatus: PaymentStatusEnum.APPROVED,
                status: OrderStatusEnum.READY,
            };

            orderRepositoryMock.findById.mockResolvedValue(null);

            // When & Then
            await expect(useCase.execute(input)).rejects.toThrow(TypeError);
        });
    });
});
