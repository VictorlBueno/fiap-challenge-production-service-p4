import {ProductEntity} from "@/domain/entities/product.entity";

export interface IOrderService {
    addNewProduct(product: ProductEntity): Promise<void>;
}