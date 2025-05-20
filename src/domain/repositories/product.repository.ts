import {RepositoryInterface} from "@/domain/shared/repositories/repository";
import {ClientEntity} from "@/domain/entities/client.entity";
import {ProductEntity} from "@/domain/entities/product.entity";

export interface IProductRepository extends RepositoryInterface<ProductEntity> {
    listByCategory(categoryId: string): Promise<ProductEntity[]>;
    findAll(): Promise<ProductEntity[]>;
}