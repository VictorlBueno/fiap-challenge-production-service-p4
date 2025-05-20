import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@/infrastructure/shared/database/prisma/prisma.service';
import {DatabaseModule} from "@/infrastructure/modules/database.module";

describe('DatabaseModule Integration', () => {
    let moduleRef: TestingModule;
    const prismaClientMock = {
        $connect: jest.fn().mockResolvedValue(undefined),
        $disconnect: jest.fn().mockResolvedValue(undefined),
    } as unknown as PrismaClient;

    describe('Default DatabaseModule', () => {
        beforeAll(async () => {
            // Given the DatabaseModule is loaded normally
            moduleRef = await Test.createTestingModule({
                imports: [DatabaseModule],
            }).compile();
        });

        it('Given DatabaseModule, When module is initialized, Then PrismaService should be defined', () => {
            // When getting PrismaService provider
            const prismaService = moduleRef.get<PrismaService>(PrismaService);

            // Then it should be defined
            expect(prismaService).toBeDefined();
        });
    });

    describe('DatabaseModule.forTest()', () => {
        let dynamicModule;

        beforeAll(() => {
            // Given the prismaClient mock
            dynamicModule = DatabaseModule.forTest(prismaClientMock);
        });

        it('Given prismaClient, When forTest() is called, Then it returns a DynamicModule with PrismaService provider', () => {
            // Then the returned module should have the right provider with the prismaClientMock
            expect(dynamicModule.module).toBe(DatabaseModule);
            expect(dynamicModule.providers).toBeDefined();
            expect(dynamicModule.providers.length).toBeGreaterThan(0);

            const prismaProvider = dynamicModule.providers.find(
                (provider) => (provider.provide || provider) === PrismaService,
            );
            expect(prismaProvider).toBeDefined();

            // The useFactory should return the mocked prisma client
            const prismaInstance = prismaProvider.useFactory();
            expect(prismaInstance).toBe(prismaClientMock);
        });
    });

    describe('Injected PrismaService from forTest()', () => {
        beforeAll(async () => {
            // Given a testing module with DatabaseModule.forTest using mock PrismaClient
            moduleRef = await Test.createTestingModule({
                imports: [DatabaseModule.forTest(prismaClientMock)],
            }).compile();
        });

        it('Given the module uses DatabaseModule.forTest, When PrismaService is injected, Then it should be the mocked prisma client', () => {
            // When retrieving PrismaService
            const prismaService = moduleRef.get<PrismaService>(PrismaService);

            // Then it should be the prismaClientMock instance
            expect(prismaService).toBe(prismaClientMock);
        });

        it('Given PrismaService instance, When calling $connect and $disconnect, Then mocked methods should be called', async () => {
            const prismaService = moduleRef.get<PrismaService>(PrismaService);

            // When calling connect and disconnect
            await prismaService.$connect();
            await prismaService.$disconnect();

            // Then the mocks should be called
            expect(prismaClientMock.$connect).toHaveBeenCalled();
            expect(prismaClientMock.$disconnect).toHaveBeenCalled();
        });
    });
});
