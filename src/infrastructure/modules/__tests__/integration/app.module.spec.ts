import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/infrastructure/shared/database/prisma/prisma.service';
import { ProductModule } from '@/infrastructure/modules/product.module';
import { OrderModule } from '@/infrastructure/modules/order.module';
import { DatabaseModule } from '@/infrastructure/modules/database.module';
import {AppModule} from "@/infrastructure/modules/app.module";
import {ClientModule} from "@/infrastructure/modules/client.module";

describe('AppModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should import ClientModule', () => {
        const clientModule = module.get(ClientModule, { strict: false });
        expect(clientModule).toBeDefined();
    });

    it('should import ProductModule', () => {
        const productModule = module.get(ProductModule, { strict: false });
        expect(productModule).toBeDefined();
    });

    it('should import OrderModule', () => {
        const orderModule = module.get(OrderModule, { strict: false });
        expect(orderModule).toBeDefined();
    });

    it('should import DatabaseModule', () => {
        const databaseModule = module.get(DatabaseModule, { strict: false });
        expect(databaseModule).toBeDefined();
    });

    it('should provide PrismaService', () => {
        const prismaService = module.get(PrismaService);
        expect(prismaService.constructor.name).toBe('PrismaService');
    });
});
