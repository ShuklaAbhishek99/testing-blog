// => forwardRef() API in react is a way to take reference

// suppose there is a login form (which a single component)
// which has 3 components (inside) email field, password field, and a button,
// we will use these three components elsehwhere too other than our form,
// when we use input or any other element directly inside a component we can access it's "ref"
// but when we use same input as a component "ref" doesn't give access to the DOM directly
// to get that access we have to use "forwardRef" which give us the direct access to it

import { forwardRef, useId } from "react";

// we used arrow function as callback, a named function can also be used,
// (like we write functional compopent which can be inserted directly)

const Input = forwardRef(function Input(
    { label, type = "text", className = "", ...props },
    ref
) {
    const id = useId();

    return (
        <div className="w-full">
            {label && (
                <label className="inline-block mb-1 pl-1" htmlFor={id}>
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
                ref={ref}
                {...props}
                id={id}
            />
        </div>
    );
});

export default Input;
