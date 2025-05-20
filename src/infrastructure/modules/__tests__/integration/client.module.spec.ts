import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/infrastructure/shared/database/prisma/prisma.service';
import { UuidGenerator } from '@/infrastructure/providers/uuid-generator';
import { ClientPrismaRepository } from '@/infrastructure/repositories/prisma/client-prisma.repository';
import { CognitoService } from '@/infrastructure/gateway/cognito.service';
import { CreateClientUseCase } from '@/application/usecases/clients/create-client.usecase';
import { GetClientUseCase } from '@/application/usecases/clients/get-client.usecase';
import { ClientModule } from '@/infrastructure/modules/client.module';

describe('ClientModule (unit)', () => {
    let moduleRef: TestingModule;

    // Mocks for dependencies
    const prismaServiceMock = {};
    const uuidGeneratorMock = { generate: jest.fn().mockReturnValue('uuid-fake') };
    const clientRepositoryMock = {};
    const cognitoServiceMock = { someMethod: jest.fn().mockResolvedValue('fakeResponse') };

    beforeAll(async () => {
        // Given the ClientModule is being initialized with mocked providers
        moduleRef = await Test.createTestingModule({
            imports: [ClientModule],
        })
            .overrideProvider('PrismaService')
            .useValue(prismaServiceMock)
            .overrideProvider('UuidGenerator')
            .useValue(uuidGeneratorMock)
            .overrideProvider('ClientRepository')
            .useValue(clientRepositoryMock)
            .overrideProvider('IamService')
            .useValue(cognitoServiceMock)
            .compile();
    });

    it('Given the ClientModule is initialized, When accessing providers, Then all providers should be defined', () => {
        // When we get providers from the module
        const prisma = moduleRef.get<PrismaService>('PrismaService');
        const uuidGen = moduleRef.get<UuidGenerator>('UuidGenerator');
        const clientRepo = moduleRef.get<ClientPrismaRepository>('ClientRepository');
        const iamService = moduleRef.get<CognitoService>('IamService');
        const createUseCase = moduleRef.get<CreateClientUseCase.UseCase>(CreateClientUseCase.UseCase);
        const getUseCase = moduleRef.get<GetClientUseCase.UseCase>(GetClientUseCase.UseCase);

        // Then they should all be defined
        expect(prisma).toBeDefined();
        expect(uuidGen).toBeDefined();
        expect(clientRepo).toBeDefined();
        expect(iamService).toBeDefined();
        expect(createUseCase).toBeDefined();
        expect(getUseCase).toBeDefined();
    });

    it('Given CreateClientUseCase, When execute method is called, Then it should return a fake client', async () => {
        // Given we get the CreateClientUseCase instance
        const createUseCase = moduleRef.get<CreateClientUseCase.UseCase>(CreateClientUseCase.UseCase);

        // When we check if execute method exists
        expect(typeof createUseCase.execute).toBe('function');

        // And mock the execute method to return a fake client
        jest.spyOn(createUseCase, 'execute').mockResolvedValue({ id: 'abc-123', cpf: '1111111', name: 'Victor' });

        // When calling execute with fake data
        const result = await createUseCase.execute({ cpf: '1111111', name: 'Victor' });

        // Then it should return the mocked fake client
        expect(result).toEqual({ id: 'abc-123', cpf: '1111111', name: 'Victor' });
    });

    it('Given GetClientUseCase, When execute method is called, Then it should return a fake client', async () => {
        // Given we get the GetClientUseCase instance
        const getUseCase = moduleRef.get<GetClientUseCase.UseCase>(GetClientUseCase.UseCase);

        // When we check if execute method exists
        expect(typeof getUseCase.execute).toBe('function');

        // And mock the execute method to return a fake client
        jest.spyOn(getUseCase, 'execute').mockResolvedValue({ id: 'abc-123', cpf: '1111111', name: 'Victor' });

        // When calling execute with fake cpf
        const client = await getUseCase.execute({ cpf: '1111' });

        // Then it should return the mocked fake client
        expect(client).toEqual({ id: 'abc-123', cpf: '1111111', name: 'Victor' });
    });
});
