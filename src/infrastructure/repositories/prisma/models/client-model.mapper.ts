import {ClientEntity} from "@/domain/entities/client.entity";

export class ClientModelMapper {
    static toEntity(model: any) {
        const data = {
            id: model.id,
            name: model.name,
            cpf: model.cpf,
        };

        return new ClientEntity(data);
    }
}