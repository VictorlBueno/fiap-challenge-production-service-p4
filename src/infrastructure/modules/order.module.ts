import {Module} from "@nestjs/common";
import {OrderController} from "@/infrastructure/controllers/order.controller";
import {PrismaService} from "@/infrastructure/shared/database/prisma/prisma.service";
import {OrderPrismaRepository} from "@/infrastructure/repositories/prisma/order-prisma.repository";
import {CreateOrderUseCase} from "@/application/usecases/orders/create-orders.usecase";
import {UpdateOrderUseCase} from "@/application/usecases/orders/update-order.usecase";
import {GetOrderPaymentStatusUseCase} from "@/application/usecases/orders/get-order-payment-status.usecase";
import {GetOrdersUseCase} from "@/application/usecases/orders/get-orders.usecase";
import {UuidGenerator} from "@/infrastructure/providers/uuid-generator";
import {ProductPrismaRepository} from "@/infrastructure/repositories/prisma/product-prisma.repository";
import {IProductRepository} from "@/domain/repositories/product.repository";

@Module({
    controllers: [OrderController],
    providers: [
        {
            provide: "PrismaService",
            useClass: PrismaService,
        },
        {
            provide: "UuidGenerator",
            useClass: UuidGenerator,
        },
        {
            provide: "OrderRepository",
            useFactory: (prismaService: PrismaService) => {
                return new OrderPrismaRepository(prismaService);
            },
            inject: [PrismaService],
        },
        {
            provide: "ProductRepository",
            useFactory: (prismaService: PrismaService) => {
                return new ProductPrismaRepository(prismaService);
            },
            inject: [PrismaService],
        },
        {
            provide: CreateOrderUseCase.UseCase,
            useFactory: (
                orderRepository: OrderPrismaRepository,
                uuidGenerator: UuidGenerator,
                productRepository: IProductRepository,
            ) => {
                return new CreateOrderUseCase.UseCase(orderRepository, productRepository, uuidGenerator);
            },
            inject: ["OrderRepository", "UuidGenerator", "ProductRepository"],
        },
        {
            provide: UpdateOrderUseCase.UseCase,
            useFactory: (orderRepository: OrderPrismaRepository) => {
                return new UpdateOrderUseCase.UseCase(orderRepository);
            },
            inject: ["OrderRepository"],
        },
        {
            provide: GetOrderPaymentStatusUseCase.UseCase,
            useFactory: (orderRepository: OrderPrismaRepository) => {
                return new GetOrderPaymentStatusUseCase.UseCase(orderRepository);
            },
            inject: ["OrderRepository"],
        },
        {
            provide: GetOrdersUseCase.UseCase,
            useFactory: (orderRepository: OrderPrismaRepository) => {
                return new GetOrdersUseCase.UseCase(orderRepository);
            },
            inject: ["OrderRepository"],
        },
    ],
})

export class OrderModule {
}
