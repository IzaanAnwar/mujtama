"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export interface LoginFormValues {
    email: string;
    password: string;
}

/**
 * Register component.
 * Allows users to Login by submitting a form.
 */
export default function Login() {
    const router = useRouter();
    const [formValue, setFormValue] = useState<LoginFormValues>({
        email: "",
        password: "",
    });
    const [postError, setPostError] = useState<string | null>(null);

    /**
     * Handles form submission.
     * Sends the form values to the next-aut server for validation.
     * @param event - Form submission event.
     */
    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();
        console.log("form val=>", formValue);
        if (formValue.email == "" || formValue.password == "") {
            setPostError("Missing Fields");
            return;
        }

        const response = await signIn("credentials", {
            email: formValue.email,
            password: formValue.password,
            redirect: false,
        });

        if (response?.error) {
            setPostError("Credentials does not match! Please try again.");
        } else {
            router.push("/dashboard");
        }
        console.log("login res =>", response);
    };

    /**
     * Handles input change events
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
        <div className="flex items-center justify-center h-screen ">
            <form
                className="form-control shadow-md rounded px-8 py-6 bg-zinc-900"
                onSubmit={handleSubmit}
            >
                <div className="mb-4">
                    <label className="label ">Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="abbas@example.com"
                        className={`input  ${
                            postError && "input-error"
                        } rounded w-full py-2 px-3 placeholder-slate-800`}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="label">Password</label>
                    <input
                        name="password"
                        type="password"
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
                    className={`text-center pt-2 text-xs text-error ${
                        !postError && "py-3"
                    }`}
                >
                    {postError}
                </div>
            </form>
        </div>
    );
}
