// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();



    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);

        const handleAuthChange = () => {
            setIsAuthenticated(!!localStorage.getItem("token"));
        };

        window.addEventListener("authChange", handleAuthChange);

        return () => {
            window.removeEventListener("authChange", handleAuthChange);
        };
    }, []);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token not found");
            }

            await axios.post("http://127.0.0.1:8000/jwt/logout", {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            localStorage.removeItem("token");
            setIsAuthenticated(false);
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed. Check the console for details.");
        }
    };

    const handleRegister = () => {
        navigate("/register");
    };

    const handleAddProduct = () => {
        navigate("/addProduct");
    };
    const handleProfile = () =>{
        navigate("/profile")
    }

    return (
        <header className="p-4 bg-blue-600 text-white flex justify-between items-center">
            <h1 className="text-xl font-bold">🏡 RealEstateApp</h1>
            <div>
                {isAuthenticated ? (
                    <>
                        <Button
                            type="primary"
                            onClick={handleAddProduct}
                            className="mr-4 bg-green-600 hover:bg-green-700"
                        >
                            Добавить товар
                        </Button>
                        <Button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Выйти
                        </Button>

                        <Button
                            onClick={handleProfile}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Профиль
                        </Button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <Button type="link" className="mr-4 text-white">
                                Войти
                            </Button>
                        </Link>
                        <Button type="link" onClick={handleRegister} className="text-white">
                            Регистрация
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
