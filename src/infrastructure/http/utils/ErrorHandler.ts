import { Response } from "express";
import { AppError } from "@shared/errors/AppError";
import { ZodError } from "zod"; 

export const handleHttpError = (err: unknown, res: Response): Response => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message }); 
    }

    if (err instanceof ZodError) {
        const messages = err.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
        }));

        return res.status(400).json({
            error: "Validation failed",
            details: messages,
        });
    }

    if (err instanceof Error) {
        if (err.name === "ValidationError" || err.name === "CastError") {
            return res.status(400).json({ error: "Invalid data format or ID" }); 
        }

        console.error(err.stack);
        return res.status(500).json({
            error: "Internal server error",
            details: err.message,
        }); 
    }

    return res.status(500).json({ error: "An unexpected error occured" }); 
};
