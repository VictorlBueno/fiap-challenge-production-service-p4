import axios, {AxiosInstance} from "axios";
import {IOrderService} from "@/domain/gateway/order.service";
import {ProductEntity} from "@/domain/entities/product.entity";

export class OrderService implements IOrderService {
    private readonly api: AxiosInstance;

    constructor(serviceUrl: string) {
        this.api = axios.create({
            baseURL: serviceUrl,
        });
    }

    async addNewProduct(product: ProductEntity): Promise<void> {
        try {
            const response = await this.api.post("/products", product.toJSON());
            return response.data;
        } catch (error: any) {
            if (error.response) {
                return error.response.data;
            }
            throw error;
        }
    }
}