import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from '@/infrastructure/controllers/client.controller';
import { CreateClientUseCase } from '@/application/usecases/clients/create-client.usecase';
import { GetClientUseCase } from '@/application/usecases/clients/get-client.usecase';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ClientController - Integration', () => {
    let controller: ClientController;
    let createClientUseCase: CreateClientUseCase.UseCase;
    let getClientUseCase: GetClientUseCase.UseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ClientController],
            providers: [
                {
                    provide: CreateClientUseCase.UseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetClientUseCase.UseCase,
                    useValue: { execute: jest.fn() },
                },
            ],
        }).compile();

        controller = module.get<ClientController>(ClientController);
        createClientUseCase = module.get<CreateClientUseCase.UseCase>(CreateClientUseCase.UseCase);
        getClientUseCase = module.get<GetClientUseCase.UseCase>(GetClientUseCase.UseCase);
    });

    describe('POST /clients - create()', () => {
        it('should create a new client and return the client output', async () => {
            // Given
            const dto = { name: 'John Doe', cpf: '52998224725', email: 'john@example.com' };
            const expectedResult = { id: '123', ...dto };

            jest.spyOn(createClientUseCase, 'execute').mockResolvedValue(expectedResult);

            // When
            const result = await controller.create(dto);

            // Then
            expect(createClientUseCase.execute).toHaveBeenCalledWith(dto);
            expect(result).toEqual(expectedResult);
        });

        it('should throw BadRequestException when create use case throws', async () => {
            const dto = { name: '', cpf: '', email: '' };
            jest.spyOn(createClientUseCase, 'execute').mockRejectedValue(new BadRequestException('Invalid input data'));

            await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('GET /clients/:cpf - findOne()', () => {
        it('should return client data when found', async () => {
            // Given
            const cpf = '52998224725';
            const expectedResult = { id: '123', name: 'John Doe', cpf, email: 'john@example.com' };

            jest.spyOn(getClientUseCase, 'execute').mockResolvedValue(expectedResult);

            // When
            const result = await controller.findOne(cpf);

            // Then
            expect(getClientUseCase.execute).toHaveBeenCalledWith({ cpf });
            expect(result).toEqual(expectedResult);
        });

        it('should throw NotFoundException when client is not found', async () => {
            const cpf = '00000000000';
            jest.spyOn(getClientUseCase, 'execute').mockRejectedValue(new NotFoundException('Client not found'));

            await expect(controller.findOne(cpf)).rejects.toThrow(NotFoundException);
        });
    });
});
