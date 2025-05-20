import {ProductEntity} from "@/domain/entities/product.entity";
import {ProductCategoryEnum} from "@/domain/enums/category.enum";
import { Product } from '@prisma/client';

export class ProductModelMapper {
    static toEntity(model: Product): ProductEntity {
        return new ProductEntity({
            id: model.id,
            name: model.name,
            description: model.description,
            price: Number(model.price),
            category: ProductCategoryEnum[model.category],
        });
    }
}
