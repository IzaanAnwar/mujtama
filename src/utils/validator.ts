import { z } from "zod";

export const registerFormSchema = z
    .object({
        name: z.string().nonempty({ message: "Name is Required" }),
        email: z.string().email({ message: "Email is required" }),
        password: z.string().min(6, { message: "Too short" }),
        confirmPass: z.string(),
    })
    .refine((data) => data.password === data.confirmPass, {
        message: "Password does not match",
        path: ["confirmPass"],
    });

export const loginFormSchema = z.object({
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(6, { message: "Too short" }),
});
