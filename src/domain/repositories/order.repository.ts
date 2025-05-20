import {RepositoryInterface} from "@/domain/shared/repositories/repository";
import {OrderEntity} from "@/domain/entities/order.entity";
import {PaymentStatusEnum} from "@/domain/enums/payment-status.enum";

export interface IOrderRepository extends RepositoryInterface<OrderEntity> {
    getPaymentStatus(id: string): Promise<{ id: string, paymentStatus: PaymentStatusEnum }>;
}