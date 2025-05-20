import {Entity} from "@/domain/shared/entities/entity";
import {ProductCategoryEnum} from "@/domain/enums/category.enum";

export type ProductProps = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ProductCategoryEnum;
};

export class ProductEntity extends Entity<ProductProps> {
    constructor(props: ProductProps) {
        super(props);
        this.props.id = props.id;
        this.props.category = props.category;
        this.props.name = props.name;
        this.props.description = props.description;
        this.props.price = props.price;
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

    get description() {
        return this.props.description;
    }

    set description(description: string) {
        this.props.description = description;
    }

    get price() {
        return this.props.price;
    }

    set price(price: number) {
        this.props.price = price;
    }

    get category() {
        return this.props.category;
    }

    set category(category: ProductCategoryEnum) {
        this.props.category = category;
    }
}
