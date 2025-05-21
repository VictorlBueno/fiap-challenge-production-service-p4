import {ClientEntity, ClientProps} from "@/domain/entities/client.entity";

export class ClientModelMapper {
    static toEntity(model: ClientProps) {
        const data = {
            id: model.id,
            name: model.name,
            cpf: model.cpf,
        };

        return new ClientEntity(data);
    }
}