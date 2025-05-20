import {Entity} from "@/domain/shared/entities/entity";

export type ClientProps = {
    id?: string;
    name: string;
    cpf: string;
}

export class ClientEntity extends Entity<ClientProps> {
    constructor(props: ClientProps) {
        super(props);
    }

    get id() {
        return this.props.id;
    }

    set id(id: string) {
        this.props.id = id;
    }

    get name() {
        return this.props.name;
    }

    set name(name: string) {
        this.props.name = name;
    }

    get cpf() {
        return this.props.cpf;
    }

    set cpf(cpf: string) {
        this.props.cpf = cpf;
    }
}