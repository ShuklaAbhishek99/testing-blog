// here we will learn how to protect pages, routes, and content with authentication

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const authStatus = useSelector((state) => state.auth.status);

    useEffect(() => {
        // below logic is not working properly, use complex which is next
        // if (authStatus === true) {
        //     navigate("/");
        // } else if (authStatus === false) {
        //     navigate("/login");
        // }

        // OR
        //let authValue = authStatus === true ? true : false

        // OR
        // when authStatus is false, redirect to this, else if redirect to other
        if (authentication && authStatus !== authentication) {
            navigate("/login");
        } else if (!authentication && authStatus !== authentication) {
            navigate("/");
        }
        setLoader(false);

        // why using navigate as dependency?
        // whenever any url changes happens it will always check if the user status is true or not
        // everytime this check is done and then only the authLayout will render the children
        // if any point user has logged out then the useNavigate result will changes, which hits a check
        // for user status, as it will be false so user will be shown login page
    }, [authStatus, navigate, authentication]);

    return loader ? <h1>Loading...</h1> : <>{children}</>;
}
