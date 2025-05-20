import { GetOrdersUseCase } from "@/application/usecases/orders/get-orders.usecase";
import { OrderStatusEnum } from "@/domain/enums/order-status.enum";

describe("GetOrdersUseCase - Integration Test", () => {
    let useCase: GetOrdersUseCase.UseCase;
    let orderRepositoryMock: any;

    beforeEach(() => {
        orderRepositoryMock = {
            findAll: jest.fn(),
        };
        useCase = new GetOrdersUseCase.UseCase(orderRepositoryMock);
    });

    describe("execute()", () => {
        it("should return an empty array if no orders found", async () => {
            // Given
            orderRepositoryMock.findAll.mockResolvedValue([]);

            // When
            const result = await useCase.execute();

            // Then
            expect(orderRepositoryMock.findAll).toHaveBeenCalled();
            expect(result).toEqual([]);
        });

        it("should return orders sorted by status and creation date", async () => {
            // Given
            const mockOrders = [
                {
                    status: OrderStatusEnum.RECEIVED,
                    createdAt: "2025-01-01T10:00:00.000Z",
                    toJSON: () => ({ id: "1", status: OrderStatusEnum.RECEIVED, createdAt: "2025-01-01T10:00:00.000Z" }),
                },
                {
                    status: OrderStatusEnum.READY,
                    createdAt: "2025-01-01T09:00:00.000Z",
                    toJSON: () => ({ id: "2", status: OrderStatusEnum.READY, createdAt: "2025-01-01T09:00:00.000Z" }),
                },
                {
                    status: OrderStatusEnum.IN_PREPARATION,
                    createdAt: "2025-01-01T11:00:00.000Z",
                    toJSON: () => ({ id: "3", status: OrderStatusEnum.IN_PREPARATION, createdAt: "2025-01-01T11:00:00.000Z" }),
                },
                {
                    status: OrderStatusEnum.READY,
                    createdAt: "2025-01-01T08:00:00.000Z",
                    toJSON: () => ({ id: "4", status: OrderStatusEnum.READY, createdAt: "2025-01-01T08:00:00.000Z" }),
                },
            ];

            orderRepositoryMock.findAll.mockResolvedValue(mockOrders);

            // When
            const result = await useCase.execute();

            // Then
            expect(orderRepositoryMock.findAll).toHaveBeenCalled();

            // expected order:
            // first by status: READY (3) > IN_PREPARATION (2) > RECEIVED (1)
            // then by createdAt ascending for same status
            expect(result).toEqual([
                { id: "4", status: OrderStatusEnum.READY, createdAt: "2025-01-01T08:00:00.000Z" },
                { id: "2", status: OrderStatusEnum.READY, createdAt: "2025-01-01T09:00:00.000Z" },
                { id: "3", status: OrderStatusEnum.IN_PREPARATION, createdAt: "2025-01-01T11:00:00.000Z" },
                { id: "1", status: OrderStatusEnum.RECEIVED, createdAt: "2025-01-01T10:00:00.000Z" },
            ]);
        });
    });
});
