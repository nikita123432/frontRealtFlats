// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";

const UsersPage = () => {
    const [users, setUsers] = useState([]); // Состояние для пользователей
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const [error, setError] = useState(null); // Состояние для ошибок
    const [usersCount, setUsersCount] = useState(0); // Состояние для количества пользователей

    // Объект для преобразования role_id в текстовое значение
    const roleMapping = {
        2: "Админ",
        1: "Пользователь",
    };

    // Эффект для получения данных при монтировании компонента
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/operations/users"); // URL вашего API
                if (!response.ok) {
                    throw new Error(`Ошибка: ${response.status}`); // Если ответ не OK
                }
                const data = await response.json(); // Получение данных из JSON
                setUsers(data); // Установка данных в состояние
            } catch (err) {
                setError(err.message); // Установка ошибки
            } finally {
                setLoading(false); // Завершение загрузки
            }
        };

        const fetchUsersCount = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/operations/count-users-today"); // URL эндпоинта
                if (!response.ok) {
                    throw new Error(`Ошибка: ${response.status}`);
                }
                const count = await response.json(); // Получаем количество пользователей
                setUsersCount(count); // Устанавливаем количество пользователей в состояние
            } catch (err) {
                setError(err.message); // Установка ошибки
            }
        };

        fetchUsers();
        fetchUsersCount(); // Запрос на количество пользователей
    }, []);

    // Функция для удаления пользователя
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/operations/users/${id}`, {
                method: "DELETE", // Используем DELETE запрос для удаления
            });
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }
            setUsers(users.filter((user) => user.User.id !== id)); // Удаляем пользователя из состояния
        } catch (err) {
            setError(err.message);
        }
    };

    // Функция для изменения роли пользователя
    const handleRoleChange = async (userId, newRoleId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/operations/users/${userId}/role`, {
                method: "PUT", // Используем PUT запрос для изменения данных
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ role_id: newRoleId }), // Отправляем новый role_id
            });

            if (!response.ok) {
                throw new Error(`Ошибка при изменении роли: ${response.status}`);
            }

            // Обновляем список пользователей
            setUsers(users.map((user) =>
                user.User.id === userId
                    ? { ...user, User: { ...user.User, role_id: newRoleId } } // Обновляем роль у конкретного пользователя
                    : user
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    // Отображение загрузки
    if (loading) {
        return <div>Загрузка...</div>;
    }

    // Отображение ошибки
    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    return (
        <div>
            <h1>Список пользователей</h1>
            <div>
                <h3>Количество пользователей за сегодня: {usersCount}</h3>
            </div>
            {users.length === 0 ? ( // Проверка на наличие пользователей
                <p>Нет доступных пользователей</p>
            ) : (
                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                }}>
                    <thead>
                    <tr>
                        <th style={{ border: "1px solid black", padding: "8px" }}>ID</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Имя</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Email</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Роль</th> {/* Новый столбец для роли */}
                        <th style={{ border: "1px solid black", padding: "8px" }}>Изменить роль</th> {/* Новый столбец для изменения роли */}
                        <th style={{ border: "1px solid black", padding: "8px" }}>Удалить</th> {/* Новый столбец для кнопки */}
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(({ User }) => ( // Извлечение объекта User
                        <tr key={User.id}>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{User.id}</td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{User.username}</td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{User.email}</td>
                            {/* Преобразование role_id в роль */}
                            <td style={{ border: "1px solid black", padding: "8px" }}>
                                {roleMapping[User.role_id] || "Неизвестно"}
                            </td>
                            <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>
                                <select
                                    value={User.role_id} // Выбранное значение роли
                                    onChange={(e) => handleRoleChange(User.id, parseInt(e.target.value))}
                                    style={{ padding: "5px", borderRadius: "5px" }}
                                >
                                    <option value={1}>Пользователь</option>
                                    <option value={2}>Админ</option>
                                </select>
                            </td>
                            <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>
                                <button
                                    onClick={() => handleDelete(User.id)} // Обработчик для кнопки удаления
                                    style={{
                                        backgroundColor: "red",
                                        color: "white",
                                        border: "none",
                                        padding: "5px 10px",
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                    }}
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UsersPage;
