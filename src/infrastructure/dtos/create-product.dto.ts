import { ApiProperty } from '@nestjs/swagger';
import { CreateProductUseCase } from "@/application/usecases/products/create-product.usecase";
import { ProductCategoryEnum } from "@/domain/enums/category.enum";

export class CreateProductDto implements CreateProductUseCase.Input {
    @ApiProperty({
        enum: ProductCategoryEnum,
        description: 'Product category',
        example: ProductCategoryEnum.BURGER
    })
    category: ProductCategoryEnum;

    @ApiProperty({
        description: 'Product description',
        example: 'Delicious hamburger with cheese and bacon'
    })
    description: string;

    @ApiProperty({
        description: 'Product name',
        example: 'Cheese Burger'
    })
    name: string;

    @ApiProperty({
        description: 'Product price',
        example: 15.99
    })
    price: number;
}
