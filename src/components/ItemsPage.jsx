// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";

const ItemsPage = () => {
    const [items, setItems] = useState([]); // Состояние для элементов
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const [error, setError] = useState(null); // Состояние для ошибок

    // Эффект для получения данных при монтировании компонента
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/operations/items"); // URL вашего API
                if (!response.ok) {
                    throw new Error(`Ошибка: ${response.status}`); // Если ответ не OK
                }
                const data = await response.json(); // Получение данных из JSON
                setItems(data); // Установка данных в состояние
            } catch (err) {
                setError(err.message); // Установка ошибки
            } finally {
                setLoading(false); // Завершение загрузки
            }
        };

        fetchItems();
    }, []); // Монтирование компонента при изменении состояния

    // Функция для удаления элемента
    const handleDelete = async (itemId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/operations/items/${itemId}`, {
                method: "DELETE", // Используем DELETE запрос
                headers: {
                    "Accept": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Ошибка при удалении: ${response.status}`);
            }

            // Удаляем элемент из состояния
            const updatedItems = items.filter((item) => item.id !== itemId);
            setItems(updatedItems); // Обновляем список элементов
        } catch (err) {
            setError(err.message); // Установка ошибки
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
            <h1>Список объектов</h1>
            {items.length === 0 ? ( // Проверка на наличие объектов
                <p>Нет доступных объектов</p>
            ) : (
                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                }}>
                    <thead>
                    <tr>
                        <th style={{ border: "1px solid black", padding: "8px" }}>ID</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Название</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Цена</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Описание</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Адрес</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Фотографии</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Тип сделки</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Тип жилья</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Удалить</th> {/* Кнопка удаления */}
                    </tr>
                    </thead>
                    <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{item.id}</td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{item.name}</td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{item.price}</td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{item.description}</td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{item.address}</td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>
                                {item.photos.length > 0 ? (
                                    item.photos.map((photo, index) => (
                                        <img key={index} src={`http://127.0.0.1:8000/images/${photo}`} alt="photo" style={{ width: "50px", height: "50px", margin: "5px" }} />
                                    ))
                                ) : (
                                    "Нет фото"
                                )}
                            </td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{item.type_of_transaction}</td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{item.type_of_housing}</td>
                            <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>
                                <button
                                    onClick={() => handleDelete(item.id)} // Обработчик для удаления
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

export default ItemsPage;
