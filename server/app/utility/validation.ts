import { ValidationError, validate } from 'class-validator';

export const AppValidation = async (input: unknown): Promise<ValidationError[] | false> => {
  const error = await validate(input as string, {
    ValidationError: { target: true }
  });

  if (error.length) {
    return error;
  }

  return false;
}