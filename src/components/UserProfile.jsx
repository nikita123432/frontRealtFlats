// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [ads, setAds] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingAds, setLoadingAds] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Функция для получения данных профиля пользователя
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/operations/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Передача токена
                    },
                });
                setUser(response.data);
                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError("Не удалось загрузить профиль пользователя.");
            } finally {
                setLoadingUser(false);
            }
        };

        // Функция для получения объявлений пользователя
        const fetchAds = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/operations/ads/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const adsWithPhoto = response.data.map((ad) => ({
                    ...ad,
                    photo: `http://127.0.0.1:8000/operations/get-photo/${ad.photo}`,
                }));
                setAds(adsWithPhoto);
                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError("Не удалось загрузить объявления.");
            } finally {
                setLoadingAds(false);
            }
        };

        fetchUser();
        fetchAds();
    }, []);

    // Функция для удаления объявления
    const handleDelete = async (adId) => {
        console.log("Удаляемое объявление ID:", adId); // Проверьте значение adId
        try {
            await axios.delete(`http://127.0.0.1:8000/operations/items/${adId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setAds((prevAds) => prevAds.filter((ad) => ad.id !== adId)); // Обновляем состояние
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            alert("Не удалось удалить объявление. Попробуйте снова.");
        }
    };

    if (loadingUser || loadingAds) {
        return <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">Загрузка...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-lg text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-6 w-96 mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Профиль пользователя</h2>
                <div className="space-y-2">
                    <p className="text-gray-700">
                        <strong className="text-gray-900">ID:</strong> {user.id}
                    </p>
                    <p className="text-gray-700">
                        <strong className="text-gray-900">Имя пользователя:</strong> {user.username}
                    </p>
                    <p className="text-gray-700">
                        <strong className="text-gray-900">Email:</strong> {user.email}
                    </p>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ваши объявления</h2>
                {ads.length > 0 ? (
                    <ul className="space-y-4">
                        {ads.map((ad) => (
                            <li key={ad.id} className="border p-4 rounded-lg">
                                <h3 className="text-lg font-bold">{ad.name}</h3>
                                <p><strong>Цена:</strong> {ad.price}</p>
                                <p><strong>Тип сделки:</strong> {ad.type_of_transaction}</p>
                                <p><strong>Тип жилья:</strong> {ad.type_of_housing}</p>
                                <p><strong>Количество комнат:</strong> {ad.number_of_rooms}</p>
                                <p><strong>Описание:</strong> {ad.description}</p>
                                <p><strong>Опции:</strong> {ad.options}</p>
                                <p><strong>Адрес:</strong> {ad.address}</p>
                                <img src={`http://127.0.0.1:8000/get-photo/${ad.photo}`} alt={ad.name} />
                                <button
                                    onClick={() => handleDelete(ad.id)}
                                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                                >
                                    Удалить
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">У вас нет активных объявлений.</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
