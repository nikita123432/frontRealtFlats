// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [roleId, setRoleId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);

        if (token) {
            // Получаем информацию о пользователе
            axios
                .get("http://127.0.0.1:8000/operations/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    console.log("User data response:", response.data); // Лог данных
                    setRoleId(response.data.role_id); // Обновляем роль
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        }

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
            setRoleId(null);
            window.location.reload();
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
    const handleFavoritesList = () => {
        navigate("favoritesList")
    }

    const handleProfile = () => {
        navigate("/profile");
    };

    const handleViewUsers = () => {
        navigate("/get_users");
    };

    const Home = () => {
        navigate("/")
    }
    const handleItemsPage = () =>{
        navigate("/items")
    }

    return (
        <header className="p-4 bg-blue-600 text-white flex justify-between items-center">
            <button className="text-xl font-bold" onClick={Home}>🏡 RealEstateApp
            </button>
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
                            type="primary"
                            onClick={handleFavoritesList}
                            className="mr-4 bg-green-600 hover:bg-green-700"
                        >
                            Избранные
                        </Button>

                        {roleId === 2 && (
                            <Button
                                type="primary"
                                onClick={handleViewUsers}
                                className="mr-4 bg-blue-600 hover:bg-blue-700"
                            >
                                Просмотр всех пользователей
                            </Button>

                        )}

                        {roleId === 2 && (
                            <Button
                                type="primary"
                                onClick={handleItemsPage}
                                className="mr-4 bg-blue-600 hover:bg-blue-700"
                            >
                                Просмотр всех объявлений
                            </Button>

                        )}

                        <Button
                            onClick={handleProfile}
                            className="mr-4 bg-gray-600 hover:bg-gray-700 text-white"
                        >
                            Профиль
                        </Button>
                        <Button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Выйти
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
