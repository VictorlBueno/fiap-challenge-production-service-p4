import { CreateProductUseCase } from "@/application/usecases/products/create-product.usecase";
import { ProductCategoryEnum } from "@/domain/enums/category.enum";
import { BadRequestError } from "@/application/shared/errors/bad-request-error";
import { ProductEntity } from "@/domain/entities/product.entity";

describe("CreateProductUseCase - Integration Test", () => {
    let useCase: CreateProductUseCase.UseCase;
    let productRepositoryMock: any;
    let uuidGeneratorMock: any;
    let orderServiceMock: any;

    beforeEach(() => {
        productRepositoryMock = {
            insert: jest.fn(),
        };

        uuidGeneratorMock = {
            generate: jest.fn(),
        };

        orderServiceMock = {
            generate: jest.fn(),
            addNewProduct: jest.fn(),
        };

        useCase = new CreateProductUseCase.UseCase(
            productRepositoryMock,
            uuidGeneratorMock,
            orderServiceMock
        );
    });

    describe("Given missing input data", () => {
        it("When executing use case Then should throw BadRequestError", async () => {
            const input = {
                name: "",
                description: "some description",
                price: 10,
                category: ProductCategoryEnum.BURGER,
            };

            await expect(useCase.execute(input)).rejects.toThrow(BadRequestError);
            await expect(useCase.execute(input)).rejects.toThrow("Input data not provided");
        });
    });

    describe("Given valid input data", () => {
        it("When executing use case Then should create product and return output", async () => {
            const input = {
                name: "Product Name",
                description: "Product Description",
                price: 50,
                category: ProductCategoryEnum.BURGER,
            };

            const generatedId = "generated-uuid";

            uuidGeneratorMock.generate.mockReturnValue(generatedId);
            productRepositoryMock.insert.mockResolvedValue(undefined);

            const toJSONSpy = jest
                .spyOn(ProductEntity.prototype, "toJSON")
                .mockReturnValue({ id: generatedId, ...input });

            const result = await useCase.execute(input);

            expect(uuidGeneratorMock.generate).toHaveBeenCalled();
            expect(productRepositoryMock.insert).toHaveBeenCalled();
            expect(toJSONSpy).toHaveBeenCalled();
            expect(result).toEqual({ id: generatedId, ...input });

            toJSONSpy.mockRestore();
        });
    });
});
