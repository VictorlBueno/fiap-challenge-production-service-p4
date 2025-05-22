import {RepositoryInterface} from "@/domain/shared/repositories/repository";
import {ProductEntity} from "@/domain/entities/product.entity";

export interface IProductRepository extends RepositoryInterface<ProductEntity> {
    listByCategory(categoryId: string): Promise<ProductEntity[]>;
    findAll(): Promise<ProductEntity[]>;
}