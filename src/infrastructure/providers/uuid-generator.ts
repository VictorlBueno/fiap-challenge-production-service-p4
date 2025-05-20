import {v4 as uuidv4} from "uuid";
import {UuidGenerator as UuidGeneratorInterface} from "@/domain/interfaces/uuid-generator";

export class UuidGenerator implements UuidGeneratorInterface {
    generate(): string {
        return uuidv4();
    }
}