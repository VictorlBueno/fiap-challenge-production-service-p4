import {UseCase as DefaultUseCase} from "@/application/shared/usecases/usecase";
import {IOrderRepository} from "@/domain/repositories/order.repository";
import {OrderOutputDto} from "@/application/dtos/order-output.dto";
import {OrderStatusEnum} from "@/domain/enums/order-status.enum";

export namespace GetOrdersUseCase {
    export type Input = {};

    export type Output = OrderOutputDto[];

    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(
            private readonly orderRepository: IOrderRepository,
        ) {
        }

        async execute(): Promise<Output> {
            const entities = await this.orderRepository.findAll();

            const statusOrder = {
                [OrderStatusEnum.READY]: 3,
                [OrderStatusEnum.IN_PREPARATION]: 2,
                [OrderStatusEnum.RECEIVED]: 1
            };

            const orderedEntities = entities.sort((a, b) => {
                const statusDiff = statusOrder[b.status] - statusOrder[a.status];
                if (statusDiff !== 0) return statusDiff;

                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });

            return orderedEntities.map(item => {
                return item.toJSON();
            });
        }
    }
}