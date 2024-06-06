import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../features/authSlice/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit } = useForm();
    const [error, setError] = useState("");

    const login = async (data) => {
        // inside login, 1st we set error to none(""), as there is no error at beginning
        // when we fetch the data using appwrite service if any error occurs this will set the error
        setError("");

        try {
            // 1st we get data from appwrite when entered data by user sent
            const session = await authService.login(data);
            // if we receive a JSON from appwrite then we call another method to get current user
            if (session) {
                const userData = await authService.getCurrentUser();
                // now whatever data is received is sent to store and react will access the data from there
                if (userData) {
                    dispatch(authLogin(userData));
                    navigate("/");
                }
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className={`flex items-center justify-center w-full`}>
            <div
                className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
            >
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && (
                    <p className="text-red-600 mt-8 text-center">{error}</p>
                )}
                {/* handleSubmit is an event of react-hook-form which triggers when the form is submitted,
                    it takes callback function to perform the task, the callback function has access to the data
                    taken from the input fields, register is an object which stores all the input values, it takes
                    key as argument and stored whatever value is given by user is stored as key value pair
                    refer docs for more details */}
                <form onSubmit={handleSubmit(login)} className="mt-8">
                    <Input
                        label="Email: "
                        placeholder="Enter your email"
                        type="email"
                        // we can pass as many props as required and for state management we will use "register"
                        // why this spread?, as the register is an object, first we spread all values and insert our value
                        // this will ad our value without overwriting other values, or else it will overwrite them if not used
                        {...register("email", {
                            required: true,
                            pattern: {
                                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                message:
                                    "Email address must be a valid address",
                            },
                        })}
                    />
                    <Input
                        label="password"
                        placeholder="Enter your password"
                        type="password"
                        {...register("password", { required: true })}
                    />
                    <Button type="submit" className="w-full">
                        Sign in
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default Login;
