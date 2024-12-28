// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { List, Button, message } from "antd";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingUser, setLoadingUser] = useState(false);
    const [error, setError] = useState("");

    // Получить данные о пользователе
    const fetchUser = async () => {
        if (!localStorage.getItem("token")) {
            setError("Токен не найден. Пожалуйста, войдите.");
            return;
        }

        setLoadingUser(true);

        try {
            const response = await axios.get("http://127.0.0.1:8000/operations/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            console.log("User data:", response.data);
            setUser(response.data);
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Не удалось загрузить профиль пользователя.");
        } finally {
            setLoadingUser(false);
        }
    };

    // Получить список избранных объектов
    const fetchFavorites = async () => {
        if (!user) return; // Не выполняем запрос, если пользователь еще не загружен

        setLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/operations/favorites/", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            console.log("Favorites data:", response.data);
            setFavorites(response.data);
        } catch (err) {
            setError("Ошибка при получении списка избранных объектов");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Удалить объект из избранного
    const removeFromFavorites = async (homeId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/operations/favorites/${homeId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            message.success("Удалено из избранного!");
            fetchFavorites(); // Обновляем список
        } catch (error) {
            console.error("Error removing from favorites:", error);
            message.error(error.response?.data?.detail || "Ошибка при удалении из избранного");
        }
    };


    // Загружаем данные пользователя и список избранного при загрузке компонента
    useEffect(() => {
        fetchUser(); // Загружаем данные пользователя
    }, []); // Этот эффект срабатывает только один раз при монтировании компонента

    useEffect(() => {
        if (user) {
            fetchFavorites(); // Если данные пользователя получены, загружаем избранное
        }
    }, [user]); // Этот эффект срабатывает каждый раз, когда пользователь обновляется

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h2>Избранное</h2>
            {loadingUser ? (
                <p>Загрузка данных пользователя...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : user ? (
                <p>Пользователь: {user.username}</p>
            ) : (
                <p>Пользователь не найден</p>
            )}
            {favorites.length === 0 && !loading ? (
                <p>Нет избранных объектов.</p>
            ) : (
                <List
                    loading={loading}
                    dataSource={favorites}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button
                                    type="link"
                                    danger
                                    onClick={() => removeFromFavorites(item.id)}
                                    key={`remove-${item.id}`}
                                >
                                    Удалить
                                </Button>,
                            ]}
                        >
                            <List.Item.Meta
                                title={item.name}
                                description={(
                                    <>
                                        <p>Цена: {item.price} | Адрес: {item.address}</p>
                                        {item.photo && (
                                            <img
                                                src={item.photo}
                                                alt={item.name}
                                                style={{ maxWidth: "100px", maxHeight: "100px" }}
                                            />
                                        )}
                                    </>
                                )}
                            />
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};

export default Favorites;
