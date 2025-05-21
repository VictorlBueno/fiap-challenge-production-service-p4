import {ProductEntity} from "@/domain/entities/product.entity";
import {ProductCategoryEnum} from "@/domain/enums/category.enum";

export class ProductModelMapper {
    static toEntity(model: any): ProductEntity {
        return new ProductEntity({
            id: model.id,
            name: model.name,
            description: model.description,
            price: Number(model.price),
            category: ProductCategoryEnum[model.category],
        });
    }
}
