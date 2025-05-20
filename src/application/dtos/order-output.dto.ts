import { ApiProperty } from '@nestjs/swagger';
import { OrderStatusEnum } from "@/domain/enums/order-status.enum";
import { PaymentStatusEnum } from "@/domain/enums/payment-status.enum";
import { ProductProps } from "@/domain/entities/product.entity";
import { ClientOutputDto } from './client-output.dto';
import {ProductCategoryEnum} from "@/domain/enums/category.enum";

export class OrderOutputDto {
    @ApiProperty({
        description: 'Order ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string;

    @ApiProperty({
        description: 'Client ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    clientId: string;

    @ApiProperty({
        description: 'Total order amount',
        example: 49.99
    })
    total: number;

    @ApiProperty({
        enum: OrderStatusEnum,
        description: 'Current status of the order',
        example: OrderStatusEnum.IN_PREPARATION
    })
    status: OrderStatusEnum;

    @ApiProperty({
        enum: PaymentStatusEnum,
        description: 'Payment status of the order',
        example: PaymentStatusEnum.APPROVED
    })
    paymentStatus: PaymentStatusEnum;

    @ApiProperty({
        description: 'List of products in the order',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                price: { type: 'number' },
                description: { type: 'string' },
                category: { enum: Object.values(ProductCategoryEnum) }
            }
        }
    })
    products: ProductProps[];

    @ApiProperty({
        description: 'Order creation date',
        example: '2024-01-21T10:30:00Z'
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Client information',
        type: ClientOutputDto
    })
    client: ClientOutputDto;
}