import {DynamicModule, Global, Module} from "@nestjs/common";
import {PrismaClient} from "@prisma/client";
import {PrismaService} from "@/infrastructure/shared/database/prisma/prisma.service";

@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})

export class DatabaseModule {
    static forTest(prismaClient: PrismaClient): DynamicModule {
        return {
            module: DatabaseModule,
            providers: [
                {
                    provide: PrismaService,
                    useFactory: () => prismaClient as PrismaService,
                },
            ],
        };
    }
}
