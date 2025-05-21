import {UseCase as DefaultUseCase} from "@/application/shared/usecases/usecase";
import {BadRequestError} from "@/application/shared/errors/bad-request-error";
import {IOrderRepository} from "@/domain/repositories/order.repository";
import {OrderOutputDto} from "@/application/dtos/order-output.dto";
import {PaymentStatusEnum} from "@/domain/enums/payment-status.enum";
import {OrderStatusEnum} from "@/domain/enums/order-status.enum";

export namespace UpdateOrderUseCase {
    export type Input = {
        id: string;
        paymentStatus?: PaymentStatusEnum;
        status?: OrderStatusEnum;
    };

    export type Output = OrderOutputDto;

    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(
            private readonly orderRepository: IOrderRepository,
        ) {
        }

        async execute(input: Input): Promise<Output> {
            const {id} = input;

            if (!id) {
                throw new BadRequestError("Input data not provided");
            }

            const entity = await this.orderRepository.findById(id);

            await entity.update(input);

            await this.orderRepository.update(entity);

            return entity.toJSON();
        }
    }
}
