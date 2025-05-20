import {UseCase as DefaultUseCase} from "@/application/shared/usecases/usecase";
import {ClientOutputDto} from "@/application/dtos/client-output.dto";
import {IIamService} from "@/domain/gateway/iam.service";

export namespace GetClientUseCase {
    export type Input = {
        cpf: string;
    };

    export type Output = ClientOutputDto;

    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(private readonly iamService: IIamService) {
        }

        async execute(input: Input): Promise<Output> {
            return await this.iamService.getUserDetailsByCpf(input.cpf);
        }
    }
}