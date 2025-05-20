import {UseCase as DefaultUseCase} from "@/application/shared/usecases/usecase";
import {BadRequestError} from "@/application/shared/errors/bad-request-error";
import {UuidGenerator} from "@/infrastructure/providers/uuid-generator";
import {ProductProps} from "@/domain/entities/product.entity";
import {IOrderRepository} from "@/domain/repositories/order.repository";
import {OrderEntity} from "@/domain/entities/order.entity";
import {IProductRepository} from "@/domain/repositories/product.repository";

export namespace CreateOrderUseCase {
    export type Input = {
        clientId: string;
        products: ProductProps[];
    };

    export type Output = {
        message: string;
    };

    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(
            private readonly orderRepository: IOrderRepository,
            private readonly productRepository: IProductRepository,
            private readonly uuidGenerator: UuidGenerator,
        ) {
        }

        async execute(input: Input): Promise<Output> {
            const {clientId, products} = input;

            if (!clientId || !products.length) {
                throw new BadRequestError("Input data not provided");
            }

            const entity = new OrderEntity({
                ...input,
                products: input.products,
                id: this.uuidGenerator.generate(),
            });

            await this.orderRepository.insert(entity);

            return {
                message: "Success!",
            };
        }
    }
}