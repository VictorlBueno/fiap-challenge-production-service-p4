import {ClientEntity} from "@/domain/entities/client.entity";
import {Client} from "@prisma/client";

export class ClientModelMapper {
    static toEntity(model: Client) {
        const data = {
            id: model.id,
            name: model.name,
            cpf: model.cpf,
        };

        return new ClientEntity(data);
    }
}