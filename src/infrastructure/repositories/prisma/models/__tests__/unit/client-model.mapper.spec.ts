import { ClientEntity } from '@/domain/entities/client.entity';
import {ClientModelMapper} from "@/infrastructure/repositories/prisma/models/client-model.mapper";

describe('ClientModelMapper', () => {
    describe('toEntity', () => {
        it('should map a Prisma Client model to a ClientEntity correctly', () => {
            // Given
            const prismaClientModel = {
                id: 'client-123',
                name: 'Victor Silva',
                cpf: '12345678900',
                // outros campos ignorados
            } as any;

            // When
            const result = ClientModelMapper.toEntity(prismaClientModel);

            // Then
            expect(result).toBeInstanceOf(ClientEntity);
            expect(result).toEqual(
                expect.objectContaining({
                    id: 'client-123',
                    name: 'Victor Silva',
                    cpf: '12345678900',
                }),
            );
        });
    });
});
