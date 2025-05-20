import {UseCase as DefaultUseCase} from "@/application/shared/usecases/usecase";
import {IOrderRepository} from "@/domain/repositories/order.repository";
import {BadRequestError} from "@/application/shared/errors/bad-request-error";
import {PaymentStatusEnum} from "@/domain/enums/payment-status.enum";

export namespace GetOrderPaymentStatusUseCase {
    export type Input = {
        id: string;
    };

    export type Output = {
        id: string;
        paymentStatus: PaymentStatusEnum;
    };

    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(
            private readonly orderRepository: IOrderRepository,
        ) {
        }

        async execute(input: Input): Promise<Output> {
            const { id } = input;

            if (!id) {
                throw new BadRequestError("Order id not provided");
            }

            const entity = await this.orderRepository.findById(id);

            if (!entity) {
                throw new BadRequestError("Order not found");
            }

            return entity.toJSON();
        }
    }
}