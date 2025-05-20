import { ClientEntity } from '@/domain/entities/client.entity';
import {CognitoService} from "@/infrastructure/gateway/cognito.service";
import AxiosMockAdapter from 'axios-mock-adapter';

describe('CognitoService Integration Tests', () => {
    let cognitoService: CognitoService;
    let axiosMock: AxiosMockAdapter;

    beforeAll(() => {
        process.env.COGNITO_URL = 'http://mocked-cognito-api.com';
    });

    beforeEach(() => {
        cognitoService = new CognitoService();
        axiosMock = new AxiosMockAdapter(cognitoService['api']);
    });

    afterEach(() => {
        axiosMock.reset();
    });

    describe('CreateUser', () => {
        it('should successfully create a user and return client data', async () => {
            // Given
            const client = new ClientEntity({ cpf: '12345678900', name: 'John Doe' });
            const apiResponse = { cpf: '12345678900', name: 'John Doe', id: 'abc123' };

            axiosMock.onPost('/clients').reply(201, apiResponse);

            // When
            const result = await cognitoService.createUser(client);

            // Then
            expect(result).toEqual(apiResponse);
        });

        it('should return error data when API responds with an error', async () => {
            // Given
            const client = new ClientEntity({ cpf: '123', name: 'Invalid User' });
            const errorResponse = { statusCode: 400, message: 'Invalid client data' };

            axiosMock.onPost('/clients').reply(400, errorResponse);

            // When
            const result = await cognitoService.createUser(client);

            // Then
            expect(result).toEqual(errorResponse);
        });

        it('should throw error when no response is returned (network error)', async () => {
            // Given
            const client = new ClientEntity({ cpf: '12345678900', name: 'John Doe' });
            axiosMock.onPost('/clients').networkError();

            // When / Then
            await expect(cognitoService.createUser(client)).rejects.toThrow();
        });
    });

    describe('GetUserDetailsByCpf', () => {
        it('should successfully return user details for a valid CPF', async () => {
            // Given
            const cpf = '12345678900';
            const apiResponse = { cpf: '12345678900', name: 'John Doe', id: 'abc123' };

            axiosMock.onGet(`/clients/${cpf}`).reply(200, apiResponse);

            // When
            const result = await cognitoService.getUserDetailsByCpf(cpf);

            // Then
            expect(result).toEqual(apiResponse);
        });

        it('should return error data when API responds with not found error', async () => {
            // Given
            const cpf = '00000000000';
            const errorResponse = { statusCode: 404, message: 'User not found' };

            axiosMock.onGet(`/clients/${cpf}`).reply(404, errorResponse);

            // When
            const result = await cognitoService.getUserDetailsByCpf(cpf);

            // Then
            expect(result).toEqual(errorResponse);
        });

        it('should throw error when no response is returned (network error)', async () => {
            // Given
            const cpf = '12345678900';
            axiosMock.onGet(`/clients/${cpf}`).networkError();

            // When / Then
            await expect(cognitoService.getUserDetailsByCpf(cpf)).rejects.toThrow();
        });
    });
});
