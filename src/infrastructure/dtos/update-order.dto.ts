import { ApiProperty } from '@nestjs/swagger';
import { UpdateOrderUseCase } from "@/application/usecases/orders/update-order.usecase";
import { PaymentStatusEnum } from "@/domain/enums/payment-status.enum";
import { OrderStatusEnum } from "@/domain/enums/order-status.enum";

export class UpdateOrderDto implements UpdateOrderUseCase.Input {
    @ApiProperty({
        description: 'Order ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string;

    @ApiProperty({
        enum: PaymentStatusEnum,
        description: 'Payment status of the order',
        example: PaymentStatusEnum.APPROVED
    })
    paymentStatus: PaymentStatusEnum;

    @ApiProperty({
        enum: OrderStatusEnum,
        description: 'Current status of the order',
        example: OrderStatusEnum.IN_PREPARATION
    })
    status: OrderStatusEnum;
}