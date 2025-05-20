import {BadRequestError} from "@/application/shared/errors/bad-request-error";

describe('BadRequestError', () => {
    describe('when a BadRequestError is thrown', () => {
        it('should have the correct message and name', () => {
            const errorMessage = 'Invalid request payload';
            const error = new BadRequestError(errorMessage);

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toBe(errorMessage);
            expect(error.name).toBe('BadRequestError');
        });
    });
});
