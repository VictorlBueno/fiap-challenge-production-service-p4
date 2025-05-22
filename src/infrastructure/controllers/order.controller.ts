import {Body, Controller, Get, Param, Post, Put} from "@nestjs/common";
import {ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UpdateOrderUseCase} from "@/application/usecases/orders/update-order.usecase";
import {UpdateOrderDto} from "@/infrastructure/dtos/update-order.dto";
import {CreateOrderUseCase} from "@/application/usecases/orders/create-orders.usecase";
import {GetOrdersUseCase} from "@/application/usecases/orders/get-orders.usecase";
import {GetOrderPaymentStatusUseCase} from "@/application/usecases/orders/get-order-payment-status.usecase";
import {OrderOutputDto} from "@/application/dtos/order-output.dto";

@ApiTags("orders")
@Controller("orders")
export class OrderController {
    constructor(
        private readonly createOrderUseCase: CreateOrderUseCase.UseCase,
        private readonly updateOrderUseCase: UpdateOrderUseCase.UseCase,
        private readonly getOrderPaymentStatusUseCase: GetOrderPaymentStatusUseCase.UseCase,
        private readonly listOrdersUseCase: GetOrdersUseCase.UseCase
    ) {
    }

    @Post()
    @ApiOperation({summary: "Create a new order"})
    @ApiResponse({
        status: 201,
        description: "Order created successfully",
    })
    @ApiResponse({status: 400, description: "Invalid input data"})
    async create(@Body() createOrderDto: CreateOrderUseCase.Input) {
        return this.createOrderUseCase.execute(createOrderDto);
    }

    @Get()
    @ApiOperation({summary: "List all orders"})
    @ApiResponse({
        status: 200,
        description: "List of orders retrieved successfully",
        type: [OrderOutputDto],
    })
    async search() {
        return this.listOrdersUseCase.execute();
    }

    @Get(":id")
    @ApiOperation({summary: "Get order payment status"})
    @ApiParam({
        name: "id",
        description: "Order ID",
    })
    @ApiResponse({
        status: 200,
        description: "Order payment status retrieved successfully",
    })
    @ApiResponse({status: 404, description: "Order not found"})
    async findOne(@Param("id") id: string) {
        return this.getOrderPaymentStatusUseCase.execute({id});
    }

    @Put(":id")
    @ApiOperation({summary: "Update order status"})
    @ApiParam({
        name: "id",
        description: "Order ID",
        type: OrderOutputDto,
    })
    @ApiResponse({
        status: 200,
        description: "Order updated successfully",
        type: UpdateOrderDto,
    })
    @ApiResponse({status: 404, description: "Order not found"})
    async update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
        return this.updateOrderUseCase.execute({id, ...updateOrderDto});
    }
}