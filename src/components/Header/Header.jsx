import React from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
    const authStatus = useSelector((state) => state.auth.status);
    const navigate = useNavigate();

    // here what we do is take navgation items inside an array, which helps us to add more
    // items whenever required and our looping of items can handle it
    const navItems = [
        {
            name: "Home",
            slug: "/",
            active: true,
        },
        {
            name: "Login",
            slug: "/login",
            active: !authStatus,
        },
        {
            name: "Signup",
            slug: "/signup",
            active: !authStatus,
        },
        {
            name: "All-Posts",
            slug: "/all-posts",
            active: authStatus,
        },
        {
            name: "Add-Post",
            slug: "/add-post",
            active: authStatus,
        },
    ];

    return (
        <header className="py-3 shadow bg-gray-400">
            <Container>
                <nav className="flex">
                    <div className="mr-4">
                        <Link to="/">
                            <Logo width="70px" />
                        </Link>
                    </div>

                    <ul className="flex ml-auto">
                        {/* both Link and useNavigate() works same in router-dom
                            we can use any, one difference is Link directly sends to that route
                            but useNavigate() first performs some tasks and then navigates*/}
                        {navItems.map((item) =>
                            item.active ? (
                                <li key={item.name}>
                                    <button
                                        onClick={() => navigate(item.slug)}
                                        className="inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ) : null
                        )}

                        {authStatus && (
                            <li>
                                <LogoutBtn />
                            </li>
                        )}
                    </ul>
                </nav>
            </Container>
        </header>
    );
}

export default Header;
