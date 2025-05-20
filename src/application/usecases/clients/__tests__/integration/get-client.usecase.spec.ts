import { ClientOutputDto } from '@/application/dtos/client-output.dto';
import { IIamService } from '@/domain/gateway/IIamService';
import { BadRequestError } from '@/application/shared/errors/bad-request-error';
import {GetClientUseCase} from "@/application/usecases/clients/get-client.usecase";

describe('GetClientUseCase', () => {
    let iamService: IIamService;
    let useCase: GetClientUseCase.UseCase;

    beforeEach(() => {
        iamService = {
            createUser: jest.fn(),
            getUserDetailsByCpf: jest.fn(),
        };

        useCase = new GetClientUseCase.UseCase(iamService);
    });

    describe('when execute is called with a valid CPF', () => {
        it('should return the client details', async () => {
            // Arrange
            const input: GetClientUseCase.Input = { cpf: '123.456.789-00' };

            const expectedOutput: ClientOutputDto = {
                id: 'client-id-123',
                name: 'Jane Doe',
                cpf: input.cpf,
            };

            (iamService.getUserDetailsByCpf as jest.Mock).mockResolvedValue(expectedOutput);

            // Act
            const output = await useCase.execute(input);

            // Assert
            expect(iamService.getUserDetailsByCpf).toHaveBeenCalledTimes(1);
            expect(iamService.getUserDetailsByCpf).toHaveBeenCalledWith(input.cpf);
            expect(output).toEqual(expectedOutput);
        });
    });

    describe('when getUserDetailsByCpf throws an error', () => {
        it('should propagate the error', async () => {
            // Arrange
            const input: GetClientUseCase.Input = { cpf: 'invalid-cpf' };
            const error = new BadRequestError('User not found');

            (iamService.getUserDetailsByCpf as jest.Mock).mockRejectedValue(error);

            // Act & Assert
            await expect(useCase.execute(input)).rejects.toThrow(BadRequestError);
            expect(iamService.getUserDetailsByCpf).toHaveBeenCalledWith(input.cpf);
        });
    });
});
