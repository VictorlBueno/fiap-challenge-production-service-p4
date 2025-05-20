import { ApiProperty } from '@nestjs/swagger';

export class ClientOutputDto {
    @ApiProperty({
        description: 'Client ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string;

    @ApiProperty({
        description: 'Client name',
        example: 'John Doe'
    })
    name: string;

    @ApiProperty({
        description: 'Client CPF',
        example: '52998224725'
    })
    cpf: string;
}