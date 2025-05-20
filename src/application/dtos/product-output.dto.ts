import { ApiProperty } from '@nestjs/swagger';
import { ProductCategoryEnum } from "@/domain/enums/category.enum";

export class ProductOutputDto {
    @ApiProperty({
        description: 'Product ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string;

    @ApiProperty({
        description: 'Product name',
        example: 'Cheeseburger'
    })
    name: string;

    @ApiProperty({
        description: 'Product description',
        example: 'Delicious burger with melted cheese'
    })
    description: string;

    @ApiProperty({
        description: 'Product price',
        example: 15.99
    })
    price: number;

    @ApiProperty({
        enum: ProductCategoryEnum,
        description: 'Product category',
        example: ProductCategoryEnum.BURGER
    })
    category: ProductCategoryEnum;
}