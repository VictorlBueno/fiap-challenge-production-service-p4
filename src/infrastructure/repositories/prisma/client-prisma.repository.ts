import {IClientRepository} from "@/domain/repositories/client.repository";
import {ClientEntity} from "@/domain/entities/client.entity";
import {PrismaService} from "@/infrastructure/shared/database/prisma/prisma.service";
import {ClientModelMapper} from "@/infrastructure/repositories/prisma/models/client-model.mapper";

export class ClientPrismaRepository implements IClientRepository {
    constructor(private readonly prismaService: PrismaService) {
    }

    async cpfExists(cpf: string): Promise<boolean> {
        const client = await this.prismaService.client.findUnique({
            where: {cpf},
        });

        return client !== null;
    }

    async delete(id: string): Promise<void> {
        await this.prismaService.client.delete({
            where: {id},
        });
    }

    async findAll(): Promise<ClientEntity[]> {
        const clients = await this.prismaService.client.findMany();
        return clients.map(item => ClientModelMapper.toEntity(item));
    }

    async findById(cpf: string): Promise<ClientEntity | null> {
        const client = await this.prismaService.client.findUnique({
            where: {cpf},
        });
        return client ? ClientModelMapper.toEntity(client) : null;
    }

    async insert(entity: ClientEntity): Promise<void> {
        await this.prismaService.client.create({
            data: {
                id: entity.props.id,
                cpf: entity.props.cpf,
                name: entity.props.name,
            },
        });
    }

    async update(entity: ClientEntity): Promise<void> {
        await this.prismaService.client.update({
            where: {id: entity.id},
            data: {
                id: entity.props.id,
                cpf: entity.props.cpf,
                name: entity.props.name,
            },
        });
    }
}
