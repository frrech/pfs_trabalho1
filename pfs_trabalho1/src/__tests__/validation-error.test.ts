import { ValidationError } from '../error/validation_error';

describe('ValidationError', () => {
  it('should create a validation error with message and status code', () => {
    const message = 'Email é obrigatório';
    const statusCode = 400;

    const error = new ValidationError(message, statusCode);

    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error).toBeInstanceOf(ValidationError);
    expect(error).toBeInstanceOf(Error);
  });

  it('should have default status code of 400', () => {
    const error = new ValidationError('Test error');
    expect(error.statusCode).toBe(400);
  });

  it('should support different status codes', () => {
    const error401 = new ValidationError('Unauthorized', 401);
    const error404 = new ValidationError('Not found', 404);
    const error500 = new ValidationError('Server error', 500);

    expect(error401.statusCode).toBe(401);
    expect(error404.statusCode).toBe(404);
    expect(error500.statusCode).toBe(500);
  });

  it('should be throwable and catchable', () => {
    const message = 'Test validation error';
    const statusCode = 422;

    expect(() => {
      throw new ValidationError(message, statusCode);
    }).toThrow(ValidationError);

    try {
      throw new ValidationError(message, statusCode);
    } catch (error: any) {
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
    }
  });
});
