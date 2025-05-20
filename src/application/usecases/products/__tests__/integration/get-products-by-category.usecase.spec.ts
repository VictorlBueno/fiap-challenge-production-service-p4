import { GetProductsByCategoryUseCase } from "@/application/usecases/products/get-products-by-category.usecase";
import { BadRequestError } from "@/application/shared/errors/bad-request-error";

describe("GetProductsByCategoryUseCase - Integration Test", () => {
    let useCase: GetProductsByCategoryUseCase.UseCase;
    let productRepositoryMock: any;

    beforeEach(() => {
        productRepositoryMock = {
            listByCategory: jest.fn(),
        };

        useCase = new GetProductsByCategoryUseCase.UseCase(productRepositoryMock);
    });

    describe("execute()", () => {
        it("should throw BadRequestError if categoryId is not provided", async () => {
            // Given input without categoryId
            const input = {};

            // When & Then
            await expect(useCase.execute(input)).rejects.toThrow(BadRequestError);
            await expect(useCase.execute(input)).rejects.toThrow("Input data not provided");
        });

        it("should return a list of products mapped to JSON", async () => {
            // Given a valid categoryId and mocked products
            const input = { categoryId: "cat-123" };

            const mockedProducts = [
                { toJSON: jest.fn().mockReturnValue({ id: "1", name: "Product 1" }) },
                { toJSON: jest.fn().mockReturnValue({ id: "2", name: "Product 2" }) },
            ];

            productRepositoryMock.listByCategory.mockResolvedValue(mockedProducts);

            // When
            const result = await useCase.execute(input);

            // Then
            expect(productRepositoryMock.listByCategory).toHaveBeenCalledWith("cat-123");
            expect(result).toEqual([
                { id: "1", name: "Product 1" },
                { id: "2", name: "Product 2" },
            ]);

            // Also check if toJSON was called on each product
            mockedProducts.forEach(product => {
                expect(product.toJSON).toHaveBeenCalled();
            });
        });
    });
});
