import {UseCase as DefaultUseCase} from "@/application/shared/usecases/usecase";
import {ClientOutputDto} from "@/application/dtos/client-output.dto";
import {ClientEntity} from "@/domain/entities/client.entity";
import {IClientRepository} from "@/domain/repositories/client.repository";
import {IIamService} from "@/domain/gateway/iam.service";

export namespace CreateClientUseCase {
    export type Input = {
        name: string;
        cpf: string;
    };

    export type Output = ClientOutputDto;

    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(
            private readonly iamService: IIamService,
            private readonly clientRepository: IClientRepository
        ) {
        }

        async execute(input: Input): Promise<Output> {
            const clientEntity = new ClientEntity({
                name: input.name,
                cpf: input.cpf,
            })

            const user = await this.iamService.createUser(clientEntity);
            clientEntity.id = user.id;

            await this.clientRepository.insert(clientEntity);

            return user;
        }
    }
}