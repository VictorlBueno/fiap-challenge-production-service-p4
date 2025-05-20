import { BadRequestError } from "@/application/shared/errors/bad-request-error";
import { ProductCategoryEnum } from "@/domain/enums/category.enum";
import { ProductEntity } from "@/domain/entities/product.entity";
import {CreateProductUseCase} from "@/application/usecases/products/create-product.usecase";

describe("CreateProductUseCase - Integration Test", () => {
    let useCase: CreateProductUseCase.UseCase;
    let productRepositoryMock: any;
    let uuidGeneratorMock: any;

    beforeEach(() => {
        productRepositoryMock = {
            insert: jest.fn(),
        };

        uuidGeneratorMock = {
            generate: jest.fn(),
        };

        useCase = new CreateProductUseCase.UseCase(productRepositoryMock, uuidGeneratorMock);
    });

    describe("execute()", () => {
        it("should throw BadRequestError if any input data is missing", async () => {
            // Given: missing name
            const incompleteInput = {
                name: "",
                description: "desc",
                price: 10,
                category: ProductCategoryEnum.BURGER,
            };

            // When & Then
            await expect(useCase.execute(incompleteInput)).rejects.toThrow(BadRequestError);
            await expect(useCase.execute(incompleteInput)).rejects.toThrow("Input data not provided");
        });

        it("should create product and return ProductOutputDto", async () => {
            // Given
            const input = {
                name: "Product 1",
                description: "Description 1",
                price: 100,
                category: ProductCategoryEnum.BURGER,
            };

            const generatedId = "uuid-1234";
            uuidGeneratorMock.generate.mockReturnValue(generatedId);

            productRepositoryMock.insert.mockResolvedValue(undefined);

            const toJSONSpy = jest.spyOn(ProductEntity.prototype, "toJSON").mockReturnValue({
                id: generatedId,
                ...input,
            });

            // When
            const result = await useCase.execute(input);

            // Then
            expect(uuidGeneratorMock.generate).toHaveBeenCalled();
            expect(productRepositoryMock.insert).toHaveBeenCalled();
            expect(toJSONSpy).toHaveBeenCalled();
            expect(result).toEqual({
                id: generatedId,
                ...input,
            });

            toJSONSpy.mockRestore();
        });
    });
});
