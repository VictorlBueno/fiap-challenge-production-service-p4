import axios, {AxiosInstance} from "axios";
import {ClientEntity} from "@/domain/entities/client.entity";
import {IIamService} from "@/domain/gateway/iam.service";

export class CognitoService implements IIamService {
    private readonly api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: process.env.COGNITO_URL,
        });
    }

    async createUser(client: ClientEntity): Promise<ClientEntity> {
        try {
            const response = await this.api.post("/clients", client.toJSON());
            return response.data;
        } catch (error: any) {
            throw error;
        }
    }

    async getUserDetailsByCpf(cpf: string): Promise<ClientEntity> {
        try {
            const response = await this.api.get(`/clients/${cpf}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                return error.response.data;
            }
            throw error;
        }
    }
}