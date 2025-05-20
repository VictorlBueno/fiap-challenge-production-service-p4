import {Body, Controller, Get, Inject, Param, Post} from "@nestjs/common";
import {ApiTags, ApiOperation, ApiResponse, ApiParam} from "@nestjs/swagger";
import {CreateClientUseCase} from "@/application/usecases/clients/create-client.usecase";
import {GetClientUseCase} from "@/application/usecases/clients/get-client.usecase";
import {CreateClientDto} from "@/infrastructure/dtos/create-client.dto";
import {ClientOutputDto} from "@/application/dtos/client-output.dto";

@ApiTags("clients")
@Controller("clients")
export class ClientController {
    constructor(
        private readonly createClientUseCase: CreateClientUseCase.UseCase,
        private readonly getClientUseCase: GetClientUseCase.UseCase
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a new client' })
    @ApiResponse({
        status: 201,
        description: 'The client has been successfully created.',
        type: ClientOutputDto
    })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    async create(@Body() createClientDto: CreateClientDto) {
        return this.createClientUseCase.execute(createClientDto);
    }

    @Get(":cpf")
    @ApiOperation({summary: "Find a client by CPF"})
    @ApiParam({
        name: "cpf",
        description: "CPF of the client",
        example: "52998224725",
    })
    @ApiResponse({
        status: 200,
        description: "The client has been found.",
        type: CreateClientDto,
    })
    @ApiResponse({status: 404, description: "Client not found."})
    async findOne(@Param("cpf") cpf: string) {
        return this.getClientUseCase.execute({cpf});
    }
}