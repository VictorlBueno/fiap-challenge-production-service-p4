import {ClientEntity} from "@/domain/entities/client.entity";

describe('ClientEntity', () => {
    describe('when a client is created without id', () => {
        it('should initialize with correct name and cpf', () => {
            const client = new ClientEntity({
                name: 'Alice Johnson',
                cpf: '111.222.333-44',
            });

            expect(client.name).toBe('Alice Johnson');
            expect(client.cpf).toBe('111.222.333-44');
            expect(client.id).toBeUndefined();
        });
    });

    describe('when a client is created with an id', () => {
        it('should store the id', () => {
            const client = new ClientEntity({
                id: 'abc-123',
                name: 'Bob Smith',
                cpf: '555.666.777-88',
            });

            expect(client.id).toBe('abc-123');
            expect(client.name).toBe('Bob Smith');
            expect(client.cpf).toBe('555.666.777-88');
        });
    });

    describe('when updating properties', () => {
        let client: ClientEntity;

        beforeEach(() => {
            client = new ClientEntity({
                name: 'Original Name',
                cpf: '000.000.000-00',
            });
        });

        it('should update the name', () => {
            client.name = 'New Name';
            expect(client.name).toBe('New Name');
        });

        it('should update the cpf', () => {
            client.cpf = '999.999.999-99';
            expect(client.cpf).toBe('999.999.999-99');
        });

        it('should update the id', () => {
            client.id = 'xyz-789';
            expect(client.id).toBe('xyz-789');
        });
    });
});
