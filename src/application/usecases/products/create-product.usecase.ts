import {UseCase as DefaultUseCase} from "@/application/shared/usecases/usecase";
import {BadRequestError} from "@/application/shared/errors/bad-request-error";
import {UuidGenerator} from "@/infrastructure/providers/uuid-generator";
import {ProductEntity} from "@/domain/entities/product.entity";
import {ProductCategoryEnum} from "@/domain/enums/category.enum";
import {IProductRepository} from "@/domain/repositories/product.repository";
import {ProductOutputDto} from "@/application/dtos/product-output.dto";
import {IOrderService} from "@/domain/gateway/order.service";

export namespace CreateProductUseCase {
    export type Input = {
        name: string;
        description: string;
        price: number;
        category: ProductCategoryEnum;
    };

    export type Output = ProductOutputDto;

    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(
            private readonly productRepository: IProductRepository,
            private readonly uuidGenerator: UuidGenerator,
            private readonly orderService: IOrderService,
        ) {
        }

        async execute(input: Input): Promise<Output> {
            const {name, description, price, category} = input;

            if (!name || !description || !price || !category) {
                throw new BadRequestError("Input data not provided");
            }

            const entity = new ProductEntity({
                ...input,
                id: this.uuidGenerator.generate(),
            });

            await this.productRepository.insert(entity);
            await this.orderService.addNewProduct(entity);

            return entity.toJSON();
        }
    }
}