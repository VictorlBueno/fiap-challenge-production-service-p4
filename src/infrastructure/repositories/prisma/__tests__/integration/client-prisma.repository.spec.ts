import { PrismaService } from '@/infrastructure/shared/database/prisma/prisma.service';
import { ClientEntity } from '@/domain/entities/client.entity';
import {ClientPrismaRepository} from "@/infrastructure/repositories/prisma/client-prisma.repository";

describe('ClientPrismaRepository Integration Test (BDD)', () => {
    let prismaService: PrismaService;
    let repository: ClientPrismaRepository;

    // Mock data
    const clientData = {
        id: 'client-id-1',
        cpf: '12345678901',
        name: 'John Doe',
    };

    const clientEntity = new ClientEntity({
        id: clientData.id,
        cpf: clientData.cpf,
        name: clientData.name,
    });

    beforeEach(() => {
        prismaService = new PrismaService();

        jest.spyOn(prismaService.client, 'findUnique').mockResolvedValue(null);
        jest.spyOn(prismaService.client, 'findMany').mockResolvedValue([]);
        jest.spyOn(prismaService.client, 'create').mockResolvedValue(null);
        jest.spyOn(prismaService.client, 'update').mockResolvedValue(null);
        jest.spyOn(prismaService.client, 'delete').mockResolvedValue(null);

        repository = new ClientPrismaRepository(prismaService);
    });

    describe('cpfExists', () => {
        it('should return true if client exists with given CPF', async () => {
            (prismaService.client.findUnique as jest.Mock).mockResolvedValue(clientData);

            const exists = await repository.cpfExists(clientData.cpf);

            expect(prismaService.client.findUnique).toHaveBeenCalledWith({ where: { cpf: clientData.cpf } });
            expect(exists).toBe(true);
        });

        it('should return false if client does not exist with given CPF', async () => {
            (prismaService.client.findUnique as jest.Mock).mockResolvedValue(null);

            const exists = await repository.cpfExists(clientData.cpf);

            expect(prismaService.client.findUnique).toHaveBeenCalledWith({ where: { cpf: clientData.cpf } });
            expect(exists).toBe(false);
        });
    });

    describe('delete', () => {
        it('should delete client by id', async () => {
            (prismaService.client.delete as jest.Mock).mockResolvedValue(undefined);

            await repository.delete(clientData.id);

            expect(prismaService.client.delete).toHaveBeenCalledWith({ where: { id: clientData.id } });
        });
    });

    describe('findAll', () => {
        it('should return list of ClientEntity', async () => {
            (prismaService.client.findMany as jest.Mock).mockResolvedValue([clientData]);

            const result = await repository.findAll();

            expect(prismaService.client.findMany).toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(ClientEntity);
            expect(result[0].props).toEqual(clientEntity.props);
        });
    });

    describe('findById', () => {
        it('should return ClientEntity when found', async () => {
            (prismaService.client.findUnique as jest.Mock).mockResolvedValue(clientData);

            const result = await repository.findById(clientData.cpf);

            expect(prismaService.client.findUnique).toHaveBeenCalledWith({ where: { cpf: clientData.cpf } });
            expect(result).toBeInstanceOf(ClientEntity);
            expect(result?.props).toEqual(clientEntity.props);
        });

        it('should return null when not found', async () => {
            (prismaService.client.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await repository.findById(clientData.cpf);

            expect(prismaService.client.findUnique).toHaveBeenCalledWith({ where: { cpf: clientData.cpf } });
            expect(result).toBeNull();
        });
    });

    describe('insert', () => {
        it('should create a new client record', async () => {
            (prismaService.client.create as jest.Mock).mockResolvedValue(clientData);

            await repository.insert(clientEntity);

            expect(prismaService.client.create).toHaveBeenCalledWith({
                data: {
                    id: clientEntity.props.id,
                    cpf: clientEntity.props.cpf,
                    name: clientEntity.props.name,
                },
            });
        });
    });

    describe('update', () => {
        it('should update an existing client record', async () => {
            (prismaService.client.update as jest.Mock).mockResolvedValue(clientData);

            await repository.update(clientEntity);

            expect(prismaService.client.update).toHaveBeenCalledWith({
                where: { id: clientEntity.id },
                data: {
                    id: clientEntity.props.id,
                    cpf: clientEntity.props.cpf,
                    name: clientEntity.props.name,
                },
            });
        });
    });
});
