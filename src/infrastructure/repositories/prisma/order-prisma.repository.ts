import {IOrderRepository} from "@/domain/repositories/order.repository";
import {OrderEntity} from "@/domain/entities/order.entity";
import {PrismaService} from "@/infrastructure/shared/database/prisma/prisma.service";
import {OrderModelMapper} from "@/infrastructure/repositories/prisma/models/order-model.mapper";
import {PaymentStatusEnum} from "@/domain/enums/payment-status.enum";
import {OrderStatusEnum} from "@/domain/enums/order-status.enum";

export class OrderPrismaRepository implements IOrderRepository {
    constructor(private readonly prismaService: PrismaService) {
    }

    async delete(id: string): Promise<void> {
        await this.prismaService.order.delete({
            where: {id},
        });
    }

    async findAll(): Promise<OrderEntity[]> {
        const orders = await this.prismaService.order.findMany({
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
                client: true,
            },
            where: {
                paymentStatus: {
                    in: [
                        PaymentStatusEnum.APPROVED,
                    ],
                },
                status: {
                    in: [
                        OrderStatusEnum.IN_PREPARATION,
                        OrderStatusEnum.RECEIVED,
                        OrderStatusEnum.READY,
                    ],
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return orders.map(order => OrderModelMapper.toEntity(order));
    }

    async getPaymentStatus(id: string): Promise<{ id: string; paymentStatus: PaymentStatusEnum }> {
        const order = await this.prismaService.order.findUnique({
            where: {id},
            select: {
                id: true,
                paymentStatus: true,
            },
        });

        return OrderModelMapper.paymentStatusToEntity(order);
    }

    async findById(id: string): Promise<OrderEntity | null> {
        const order = await this.prismaService.order.findUnique({
            where: {id},
            include: {
                products: true,
                client: true,
            },
        });

        return order ? OrderModelMapper.toEntity(order) : null;
    }

    async insert(entity: OrderEntity): Promise<void> {
        try {
            await this.prismaService.order.create({
                data: {
                    id: entity.props.id,
                    total: entity.props.total,
                    status: entity.props.status,
                    paymentStatus: entity.props.paymentStatus,
                    client: {
                        connect: {
                            id: entity.props.clientId,
                        },
                    },
                    products: {
                        create: entity.props.products.map(product => ({
                            product: {
                                connect: {
                                    id: product.id,
                                },
                            },
                        })),
                    },
                },
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async update(entity: OrderEntity): Promise<void> {
        await this.prismaService.order.update({
            where: {id: entity.props.id},
            data: {
                status: entity.props.status,
                paymentStatus: entity.props.paymentStatus,
            },
        });
    }
}
