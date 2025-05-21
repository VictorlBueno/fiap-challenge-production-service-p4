import {OrderEntity} from "@/domain/entities/order.entity";
import {ClientModelMapper} from "@/infrastructure/repositories/prisma/models/client-model.mapper";
import {PaymentStatusEnum} from "@/domain/enums/payment-status.enum";
import {OrderStatusEnum} from "@/domain/enums/order-status.enum";

export class OrderModelMapper {
    static toEntity(model: any & { products: any, client: any }): OrderEntity {
        return new OrderEntity({
            id: model.id,
            clientId: model.clientId,
            status: OrderStatusEnum[model.status],
            paymentStatus: PaymentStatusEnum[model.paymentStatus],
            total: Number(model.total),
            products: model.products,
            client: ClientModelMapper.toEntity(model.client),
        });
    }

    static paymentStatusToEntity(model: any) {
        return {
            id: model.id,
            paymentStatus: PaymentStatusEnum[model.paymentStatus],
        };
    }
}
