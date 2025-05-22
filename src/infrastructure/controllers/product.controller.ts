import {Body, Controller, Delete, Get, HttpCode, Param, Post} from "@nestjs/common";
import {ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateProductUseCase} from "@/application/usecases/products/create-product.usecase";
import {GetProductsByCategoryUseCase} from "@/application/usecases/products/get-products-by-category.usecase";
import {CreateProductDto} from "@/infrastructure/dtos/create-product.dto";
import {DeleteProductUsecase} from "@/application/usecases/products/delete-product.usecase";
import {ProductCategoryEnum} from "@/domain/enums/category.enum";
import {ProductOutputDto} from "@/application/dtos/product-output.dto";

@ApiTags('products')
@Controller("products")
export class ProductController {
    constructor(
        private readonly createProductUseCase: CreateProductUseCase.UseCase,
        private readonly deleteProductUseCase: DeleteProductUsecase.UseCase,
        private readonly getProductByCategoryUseCase: GetProductsByCategoryUseCase.UseCase
    ) {
    }

    @Post()
    @ApiOperation({
        summary: 'Create a new product',
        description: 'Creates a new product in the system'
    })
    @ApiResponse({
        status: 201,
        description: 'Product created successfully',
        type: ProductOutputDto
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid input data',
        schema: {
            type: 'object',
            properties: {
                statusCode: {type: 'number', example: 400},
                message: {type: 'string', example: 'Invalid product data'},
                error: {type: 'string', example: 'Bad Request'}
            }
        }
    })
    async create(@Body() createProductDto: CreateProductDto) {
        return this.createProductUseCase.execute(createProductDto);
    }

    @HttpCode(204)
    @Delete(":id")
    @ApiOperation({summary: 'Delete a product'})
    @ApiParam({
        name: 'id',
        description: 'Product ID'
    })
    @ApiResponse({status: 204, description: 'Product deleted successfully'})
    @ApiResponse({status: 404, description: 'Product not found'})
    async remove(@Param("id") id: string) {
        await this.deleteProductUseCase.execute({id});
    }

    @Get("category/:categoryId")
    @ApiOperation({summary: 'Get products by category'})
    @ApiParam({
        name: 'categoryId',
        description: 'Category ID',
        enum: ProductCategoryEnum
    })
    @ApiResponse({
        status: 200,
        description: 'Products retrieved successfully',
        type: [ProductOutputDto]
    })
    async listByCategory(@Param("categoryId") categoryId: string) {
        return this.getProductByCategoryUseCase.execute({categoryId});
    }
}
