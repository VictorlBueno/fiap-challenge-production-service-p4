import {ClientOutputDto} from '@/application/dtos/client-output.dto';
import {ClientEntity} from '@/domain/entities/client.entity';
import {IClientRepository} from '@/domain/repositories/client.repository';
import {CreateClientUseCase} from "@/application/usecases/clients/create-client.usecase";
import {IIamService} from "@/domain/gateway/iam.service";

describe('CreateClientUseCase', () => {
    let iamService: IIamService;
    let clientRepository: IClientRepository;
    let useCase: CreateClientUseCase.UseCase;

    beforeEach(() => {
        iamService = {
            createUser: jest.fn(),
            getUserDetailsByCpf: jest.fn(),
        };

        clientRepository = {
            insert: jest.fn(),
            cpfExists: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        useCase = new CreateClientUseCase.UseCase(iamService, clientRepository);
    });

    describe('when execute is called', () => {
        it('should create a new client, assign an ID from iamService, and insert into repository', async () => {
            // Arrange
            const input: CreateClientUseCase.Input = {
                name: 'John Doe',
                cpf: '123.456.789-00',
            };

            const expectedUser: ClientOutputDto = {
                id: 'generated-id',
                name: input.name,
                cpf: input.cpf,
            };

            (iamService.createUser as jest.Mock).mockImplementation(
                async (client: ClientEntity) => ({
                    id: 'generated-id',
                    name: client.name,
                    cpf: client.cpf,
                }),
            );

            const insertSpy = clientRepository.insert as jest.Mock;

            // Act
            const output = await useCase.execute(input);

            // Assert
            expect(iamService.createUser).toHaveBeenCalledTimes(1);
            expect(iamService.createUser).toHaveBeenCalledWith(expect.any(ClientEntity));

            expect(clientRepository.insert).toHaveBeenCalledTimes(1);
            expect(clientRepository.insert).toHaveBeenCalledWith(expect.objectContaining({
                id: 'generated-id',
                name: input.name,
                cpf: input.cpf,
            }));

            expect(output).toEqual(expectedUser);
        });
    });
});
