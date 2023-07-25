"use client";
import { registerFormSchema } from "@/utils/validator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface RegisterFormValues {
    name: string;
    email: string;
    password: string;
    confirmPass: string;
}

/**
 * Register component.
 * Allows users to register by submitting a form.
 */
export default function Register() {
    const router = useRouter();
    const [formValue, setFormValue] = useState<RegisterFormValues>({
        name: "",
        email: "",
        password: "",
        confirmPass: "",
    });
    const [postError, setPostError] = useState<string | null>();

    /**
     * Handles form submission.
     * Sends the form values to the server for registration.
     * @param event - Form submission event.
     */
    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        try {
            const formValidationRes = registerFormSchema.safeParse(formValue);
            if (!formValidationRes.success) {
                const errMsg = formValidationRes.error.errors;
                if (errMsg.length > 1) {
                    setPostError("Please fill the form");
                    return;
                }
                errMsg.forEach((err) => {
                    setPostError(err.message);
                });

                return;
            }
            const response = await fetch("/api/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formValue),
            });
            console.log("reg response => ", response);

            if (response.status === 201) {
                router.push("/login");
            } else if (response.status === 409) {
                setPostError("Account Exists");
            } else {
                const message = await response.json();

                setPostError(message.message);
            }
        } catch (error: any) {
            setPostError(error.message);
            console.log(error.message);
        }
    };

    /**
     * Handles input change events.
     * Updates the form value state based on the changed input field.
     * @param event - Input change event.
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;
        setFormValue({
            ...formValue,
            [name]: value,
        });
    };
    return (
        <div className="flex items-center justify-center h-screen">
            <form
                className="form-control shadow-md rounded px-8 py-6 bg-zinc-900"
                onSubmit={handleSubmit}
            >
                <div className="mb-2">
                    <label className="label">Name</label>
                    <input
                        name="name"
                        placeholder="Abbas"
                        className={`input ${
                            postError && "input-error"
                        } rounded w-full py-2 px-3 placeholder-slate-800`}
                        type="text"
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-2">
                    <label className="label">Email</label>
                    <input
                        placeholder="abbas@example.com"
                        name="email"
                        type="email"
                        className={`input ${
                            postError && "input-error"
                        } rounded w-full py-2 px-3 placeholder-slate-800`}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-2">
                    <label className="label">Password</label>
                    <input
                        type="password"
                        name="password"
                        className={`input ${
                            postError && "input-error"
                        } rounded w-full py-2 px-3`}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-2">
                    <label className="label">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPass"
                        className={`input ${
                            postError && "input-error"
                        } rounded w-full py-2 px-3`}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex items-center justify-center">
                    <input
                        className="btn btn-primary rounded"
                        type="submit"
                        value="Submit"
                    />
                </div>
                <div
                    className={`text-center text-xs text-error ${
                        !postError && "py-3"
                    }`}
                >
                    {postError === "Account Exists" ? (
                        <div className="flex justify-center items-center">
                            {postError}
                            <Link href="/login" className="text-accent px-4">
                                Login?
                            </Link>
                        </div>
                    ) : (
                        postError
                    )}
                </div>
            </form>
        </div>
    );
}
