import { ApiProperty } from '@nestjs/swagger';
import { CreateClientUseCase } from "@/application/usecases/clients/create-client.usecase";

export class CreateClientDto implements CreateClientUseCase.Input {
    @ApiProperty({
        description: 'CPF of the client',
        example: '12345678900'
    })
    cpf: string;

    @ApiProperty({
        description: 'Name of the client',
        example: 'John Doe'
    })
    name: string;
}