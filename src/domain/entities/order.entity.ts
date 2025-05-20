import {Entity} from "@/domain/shared/entities/entity";
import {ProductProps} from "@/domain/entities/product.entity";
import {OrderStatusEnum} from "@/domain/enums/order-status.enum";
import {PaymentStatusEnum} from "@/domain/enums/payment-status.enum";
import {ClientEntity} from "@/domain/entities/client.entity";

export type OrderProps = {
    id: string;
    clientId: string;
    total?: number;
    status?: OrderStatusEnum;
    paymentStatus?: PaymentStatusEnum;
    products: ProductProps[];
    createdAt?: Date;
    client?: ClientEntity;
};

export class OrderEntity extends Entity<OrderProps> {
    constructor(props: OrderProps) {
        super(props);
        this.props.createdAt = new Date();
        this.props.status = props.status || OrderStatusEnum.RECEIVED;
        this.props.paymentStatus = props.paymentStatus || PaymentStatusEnum.PENDING;
        this.props.total = props.total || props.products.reduce((acc, cur) => {
            return acc + cur.price;
        }, 0);
    }

    get id() {
        return this.props.id;
    }

    private set id(id: string) {
        this.props.id = id;
    }

    get clientId() {
        return this.props.clientId;
    }

    private set clientId(clientId: string) {
        this.props.clientId = clientId;
    }

    get total() {
        return this.props.total;
    }

    private set total(total: number) {
        this.props.total = total;
    }

    get status() {
        return this.props.status;
    }

    private set status(status: OrderStatusEnum) {
        this.props.status = status;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    private set createdAt(createdAt: Date) {
        this.props.createdAt = createdAt;
    }

    get paymentStatus() {
        return this.props.paymentStatus;
    }

    private set paymentStatus(paymentStatus: PaymentStatusEnum) {
        this.props.paymentStatus = paymentStatus;
    }

    async update(props: Partial<OrderProps>) {
        this.props.paymentStatus = props.paymentStatus || this.props.paymentStatus;
        this.props.status = props.status || this.props.status;
        this.props.total = props.total || this.props.total;
        this.props.clientId = props.clientId || this.props.clientId;
        this.props.total = props.total || this.props.total;
    }
}
