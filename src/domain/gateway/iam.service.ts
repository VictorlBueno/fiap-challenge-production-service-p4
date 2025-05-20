import {ClientEntity} from "../entities/client.entity";

export interface IIamService {
    createUser(client: ClientEntity): Promise<ClientEntity>;

    getUserDetailsByCpf(cpf: string): Promise<ClientEntity>;
}