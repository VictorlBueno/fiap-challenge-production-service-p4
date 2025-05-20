import { PrismaService } from '@/infrastructure/shared/database/prisma/prisma.service';
import { PaymentStatusEnum } from '@/domain/enums/payment-status.enum';
import { OrderStatusEnum } from '@/domain/enums/order-status.enum';
import { OrderModelMapper } from '@/infrastructure/repositories/prisma/models/order-model.mapper';
import {OrderPrismaRepository} from "@/infrastructure/repositories/prisma/order-prisma.repository";

describe('OrderPrismaRepository Integration', () => {
    let prismaService: PrismaService;
    let repository: OrderPrismaRepository;

    beforeEach(() => {
        prismaService = new PrismaService();

        // Mock all Prisma order model methods
        jest.spyOn(prismaService.order, 'delete').mockResolvedValue(undefined as any);
        jest.spyOn(prismaService.order, 'findMany').mockResolvedValue([]);
        jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue(null);
        jest.spyOn(prismaService.order, 'create').mockResolvedValue(undefined as any);
        jest.spyOn(prismaService.order, 'update').mockResolvedValue(undefined as any);

        repository = new OrderPrismaRepository(prismaService);
    });

    describe('Given an OrderPrismaRepository', () => {
        it('When delete is called, Then it should delete the order by id', async () => {
            await repository.delete('order-id-123');
            expect(prismaService.order.delete).toHaveBeenCalledWith({ where: { id: 'order-id-123' } });
        });

        it('When findAll is called, Then it should return a list of OrderEntity', async () => {
            const fakeOrders = [
                {
                    id: 'order-1',
                    total: 100,
                    status: OrderStatusEnum.IN_PREPARATION,
                    paymentStatus: PaymentStatusEnum.APPROVED,
                    products: [],
                    client: {},
                    createdAt: new Date(),
                },
            ];

            (prismaService.order.findMany as jest.Mock).mockResolvedValue(fakeOrders);
            jest.spyOn(OrderModelMapper, 'toEntity').mockImplementation(order => order as any);

            const orders = await repository.findAll();

            expect(prismaService.order.findMany).toHaveBeenCalledWith({
                include: {
                    products: { include: { product: true } },
                    client: true,
                },
                where: {
                    paymentStatus: { in: [PaymentStatusEnum.APPROVED] },
                    status: { in: [OrderStatusEnum.IN_PREPARATION, OrderStatusEnum.RECEIVED, OrderStatusEnum.READY] },
                },
                orderBy: { createdAt: 'desc' },
            });

            expect(orders).toEqual(fakeOrders);
        });

        it('When getPaymentStatus is called, Then it should return payment status object', async () => {
            const fakeOrder = { id: 'order-1', paymentStatus: PaymentStatusEnum.APPROVED };
            (prismaService.order.findUnique as jest.Mock).mockResolvedValue(fakeOrder);
            jest.spyOn(OrderModelMapper, 'paymentStatusToEntity').mockReturnValue(fakeOrder);

            const paymentStatus = await repository.getPaymentStatus('order-1');

            expect(prismaService.order.findUnique).toHaveBeenCalledWith({
                where: { id: 'order-1' },
                select: { id: true, paymentStatus: true },
            });
            expect(paymentStatus).toEqual(fakeOrder);
        });

        it('When findById is called, Then it should return an OrderEntity or null', async () => {
            const fakeOrder = {
                id: 'order-1',
                products: [],
                client: {},
            };

            (prismaService.order.findUnique as jest.Mock).mockResolvedValue(fakeOrder);
            jest.spyOn(OrderModelMapper, 'toEntity').mockReturnValue(fakeOrder as any);

            const order = await repository.findById('order-1');

            expect(prismaService.order.findUnique).toHaveBeenCalledWith({
                where: { id: 'order-1' },
                include: { products: true, client: true },
            });
            expect(order).toEqual(fakeOrder);
        });

        it('When insert is called, Then it should create an order', async () => {
            const fakeEntity = {
                props: {
                    id: 'order-1',
                    total: 100,
                    status: OrderStatusEnum.IN_PREPARATION,
                    paymentStatus: PaymentStatusEnum.APPROVED,
                    clientId: 'client-1',
                    products: [{ id: 'prod-1' }, { id: 'prod-2' }],
                },
            } as any;

            await repository.insert(fakeEntity);

            expect(prismaService.order.create).toHaveBeenCalledWith({
                data: {
                    id: 'order-1',
                    total: 100,
                    status: OrderStatusEnum.IN_PREPARATION,
                    paymentStatus: PaymentStatusEnum.APPROVED,
                    client: { connect: { id: 'client-1' } },
                    products: { create: [{ product: { connect: { id: 'prod-1' } } }, { product: { connect: { id: 'prod-2' } } }] },
                },
            });
        });

        it('When update is called, Then it should update the order', async () => {
            const fakeEntity = {
                props: {
                    id: 'order-1',
                    status: OrderStatusEnum.READY,
                    paymentStatus: PaymentStatusEnum.APPROVED,
                },
            } as any;

            await repository.update(fakeEntity);

            expect(prismaService.order.update).toHaveBeenCalledWith({
                where: { id: 'order-1' },
                data: {
                    status: OrderStatusEnum.READY,
                    paymentStatus: PaymentStatusEnum.APPROVED,
                },
            });
        });
    });
});
