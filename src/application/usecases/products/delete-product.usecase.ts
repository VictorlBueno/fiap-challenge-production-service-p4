import {UseCase as DefaultUseCase} from "@/application/shared/usecases/usecase";
import {IProductRepository} from "@/domain/repositories/product.repository";
import {BadRequestError} from "@/application/shared/errors/bad-request-error";

export namespace DeleteProductUsecase {
    export type Input = {
        id?: string;
    };

    export type Output = {
        message: string;
    };

    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(
            private readonly productRepository: IProductRepository,
        ) {
        }

        async execute(input: Input): Promise<Output> {
            const {id} = input;

            if (!id) {
                throw new BadRequestError("Input data not provided");
            }

            await this.productRepository.delete(id);

            return {
                message: "Success!",
            }
        }
    }
}
