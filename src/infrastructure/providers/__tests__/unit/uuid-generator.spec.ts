import { UuidGenerator } from '@/infrastructure/providers/uuid-generator';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid');

describe('UuidGenerator Unit Test (BDD)', () => {
    let uuidGenerator: UuidGenerator;

    beforeEach(() => {
        uuidGenerator = new UuidGenerator();
    });

    describe('generate()', () => {
        it('should exist as a function', () => {
            expect(typeof uuidGenerator.generate).toBe('function');
        });

        it('should return a UUID string', () => {
            const fakeUuid = '123e4567-e89b-12d3-a456-426614174000';
            (uuidv4 as jest.Mock).mockReturnValue(fakeUuid);

            // Act
            const result = uuidGenerator.generate();

            // Assert
            expect(result).toBe(fakeUuid);
            expect(uuidv4).toHaveBeenCalled();
        });
    });
});
