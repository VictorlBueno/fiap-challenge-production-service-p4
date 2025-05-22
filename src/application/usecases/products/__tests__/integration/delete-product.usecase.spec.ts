import { DeleteProductUsecase } from "@/application/usecases/products/delete-product.usecase";
import { BadRequestError } from "@/application/shared/errors/bad-request-error";

describe("DeleteProductUsecase - Integration Test", () => {
    let useCase: DeleteProductUsecase.UseCase;
    let productRepositoryMock: any;

    beforeEach(() => {
        productRepositoryMock = {
            delete: jest.fn(),
        };

        useCase = new DeleteProductUsecase.UseCase(productRepositoryMock);
    });

    describe("execute()", () => {
        it("should throw BadRequestError if id is not provided", async () => {
            // Given input without id
            const input = {};

            // When & Then
            await expect(useCase.execute(input)).rejects.toThrow(BadRequestError);
            await expect(useCase.execute(input)).rejects.toThrow("Input data not provided");
        });

        it("should call productRepository.delete with the provided id", async () => {
            // Given a valid id
            const input = { id: "product-123" };

            // Mock delete resolves normally
            productRepositoryMock.delete.mockResolvedValue(undefined);

            // When
            await expect(useCase.execute(input)).resolves.toStrictEqual({message: "Success!"});

            // Then
            expect(productRepositoryMock.delete).toHaveBeenCalledWith("product-123");
        });
    });
});
