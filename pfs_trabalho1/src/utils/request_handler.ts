import { errorProcessing } from "../error/error_processing";
import { ValidationError } from "../error/validation_error";

export async function handleRequest(req: any, res: any, action: () => Promise<any>, successStatus: number = 200): Promise<void> {
    try{
        const result = await action();
        res.status(successStatus).json(result);
    } catch (error: any) {
        // If it's a ValidationError with statusCode, use it; otherwise, convert to ValidationError
        const handledError = error instanceof ValidationError ? error : new ValidationError(error.message, 500);
        errorProcessing(handledError);
        res.status(handledError.statusCode).json({ message: handledError.message });
    }
}
