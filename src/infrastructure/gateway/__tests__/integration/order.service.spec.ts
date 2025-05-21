import {ProductEntity} from "@/domain/entities/product.entity";
import axios from "axios";
import {ProductCategoryEnum} from "@/domain/enums/category.enum";
import {OrderService} from "@/infrastructure/gateway/order.service";

jest.mock("axios");

describe("OrderService - Integration Test", () => {
    let service: OrderService;
    let mockAxiosInstance: any;
    let product: ProductEntity;

    beforeEach(() => {
        mockAxiosInstance = {
            post: jest.fn(),
        };

        (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

        service = new OrderService("http://fake-url");
        product = new ProductEntity({id: "1", name: "Product", description: "Desc", price: 10, category: ProductCategoryEnum.PIZZA});
    });

    describe("Given a valid product", () => {
        it("When addNewProduct is called Then should post product and return data", async () => {
            const expectedResponse = { success: true };

            mockAxiosInstance.post.mockResolvedValue({
                data: expectedResponse,
            });

            const result = await service.addNewProduct(product);

            expect(mockAxiosInstance.post).toHaveBeenCalledWith("/products", product.toJSON());
            expect(result).toEqual(expectedResponse);
        });
    });

    describe("Given a failed request with response", () => {
        it("When addNewProduct is called Then should return response data from error", async () => {
            const expectedErrorResponse = { error: "Bad Request" };

            mockAxiosInstance.post.mockRejectedValue({
                response: { data: expectedErrorResponse },
            });

            const result = await service.addNewProduct(product);

            expect(result).toEqual(expectedErrorResponse);
        });
    });

    describe("Given a failed request without response", () => {
        it("When addNewProduct is called Then should throw the error", async () => {
            const thrownError = new Error("Network Error");

            mockAxiosInstance.post.mockRejectedValue(thrownError);

            await expect(service.addNewProduct(product)).rejects.toThrow("Network Error");
        });
    });
});
