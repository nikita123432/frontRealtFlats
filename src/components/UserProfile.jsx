// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [ads, setAds] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingAds, setLoadingAds] = useState(true);
    const [error, setError] = useState(null);
    const [editAd, setEditAd] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        type_of_transaction: '',
        type_of_housing: '',
        description: '',
        address: '',
        number_of_rooms: '',
        square: '',
        year_of_construction: '',
        floor: '',
        ceiling_height: '',
        balcony: false,
        internet: false,
        elevator: false,
    });

    // Fetch user and ads data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/operations/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
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

        const fetchAds = () => {
            axios
                .get("http://127.0.0.1:8000/operations/ads/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                .then((response) => {
                    const adsWithPhoto = response.data.map((ad) => ({
                        key: ad.id,
                        name: ad.name,
                        price: ad.price,
                        type_of_transaction: ad.type_of_transaction,
                        type_of_housing: ad.type_of_housing,
                        description: ad.description,
                        address: ad.address,
                        number_of_rooms: ad.options?.number_of_rooms || '',
                        square: ad.options?.square || '',
                        year_of_construction: ad.options?.year_of_construction || '',
                        floor: ad.options?.floor || '',
                        ceiling_height: ad.options?.ceiling_height || '',
                        balcony: ad.options?.balcony || false,
                        internet: ad.options?.internet || false,
                        elevator: ad.options?.elevator || false,
                    }));
                    setAds(adsWithPhoto);
                })
                // .catch(() => {
                //     setError("Не удалось загрузить объявления.");
                // })
                .finally(() => {
                    setLoadingAds(false);
                });
        };

        fetchUser();
        fetchAds();
    }, []);

    // Handle delete ad
    const handleDelete = async (adId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/operations/items/${adId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setAds((prevAds) => prevAds.filter((ad) => ad.key !== adId));
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            alert("Не удалось удалить объявление. Попробуйте снова.");
        }
    };

    // Handle edit ad
    const handleEdit = (ad) => {
        const options = ad.options || {};

        const newFormData = {
            key: ad.key || ad.id,
            name: ad.name,
            price: ad.price,
            type_of_transaction: ad.type_of_transaction,
            type_of_housing: ad.type_of_housing,
            description: ad.description,
            address: ad.address,
            number_of_rooms: options.number_of_rooms || '',
            square: options.square || '',
            year_of_construction: options.year_of_construction || '',
            floor: options.floor || '',
            ceiling_height: options.ceiling_height || '',
            balcony: options.balcony || false,
            internet: options.internet || false,
            elevator: options.elevator || false,
        };
        setFormData(newFormData);
        setEditAd(ad);
    };

    // Submit edited ad data
    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateRealEstate(formData);
        setEditAd(null); // Закрываем форму редактирования после сохранения
    };

    // Update real estate data
    const updateRealEstate = async (formData) => {
        try {
            const form = new FormData();
            form.append('name', formData.name);
            form.append('price', formData.price);
            form.append('type_of_transaction', formData.type_of_transaction);
            form.append('type_of_housing', formData.type_of_housing);
            form.append('description', formData.description);
            form.append('address', formData.address);
            form.append('number_of_rooms', formData.number_of_rooms);
            form.append('square', formData.square);
            form.append('year_of_construction', formData.year_of_construction);
            form.append('floor', formData.floor);
            form.append('ceiling_height', formData.ceiling_height);
            form.append('balcony', formData.balcony);
            form.append('internet', formData.internet);
            form.append('elevator', formData.elevator);

            const response = await fetch(`http://127.0.0.1:8000/operations/edit-real-estate/${formData.key}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                },
                body: form
            });

            const result = await response.json();
            if (response.ok) {
                console.log("Недвижимость обновлена", result);
                // Optionally update ads in the UI if the server responds successfully
                setAds((prevAds) =>
                    prevAds.map((ad) =>
                        ad.key === formData.key ? { ...ad, ...formData } : ad
                    )
                );
            } else {
                console.log("Ошибка обновления недвижимости", result);
            }
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle checkbox changes
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: checked,
        }));
    };

    // Loading and error states
    if (loadingUser || loadingAds) {
        return <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">Загрузка...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-lg text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
            {/* User profile section */}
            <div className="bg-white shadow-md rounded-lg p-6 w-96 mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Профиль пользователя</h2>
                <div className="space-y-2">
                    <p className="text-gray-700"><strong className="text-gray-900">ID:</strong> {user.id}</p>
                    <p className="text-gray-700"><strong className="text-gray-900">Имя пользователя:</strong> {user.username}</p>
                    <p className="text-gray-700"><strong className="text-gray-900">Email:</strong> {user.email}</p>
                </div>
            </div>

            {/* Ads section */}
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ваши объявления</h2>
                {ads.length > 0 ? (
                    <ul className="space-y-4">
                        {ads.map((ad) => (
                            <li key={ad.key} className="border p-4 rounded-lg">
                                <h3 className="text-lg font-bold">{ad.name}</h3>
                                <p><strong>Цена:</strong> {ad.price}</p>
                                <p><strong>Тип сделки:</strong> {ad.type_of_transaction}</p>
                                <p><strong>Тип жилья:</strong> {ad.type_of_housing}</p>
                                <p><strong>Количество комнат:</strong> {ad.number_of_rooms}</p>
                                <p><strong>Описание:</strong> {ad.description}</p>
                                <p><strong>Опции:</strong></p>
                                <ul className="list-disc pl-6">
                                    {ad.square && <li><strong>Площадь:</strong> {ad.square} м²</li>}
                                    {ad.year_of_construction &&
                                        <li><strong>Год постройки:</strong> {ad.year_of_construction}</li>}
                                    {ad.floor && <li><strong>Этаж:</strong> {ad.floor}</li>}
                                    {ad.ceiling_height && <li><strong>Высота потолков:</strong> {ad.ceiling_height} м</li>}
                                    {ad.balcony && <li><strong>Балкон:</strong> Да</li>}
                                    {ad.internet && <li><strong>Интернет:</strong> Да</li>}
                                    {ad.elevator && <li><strong>Лифт:</strong> Да</li>}
                                </ul>
                                <div className="mt-4 flex justify-between">
                                    <button
                                        onClick={() => handleEdit(ad)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ad.key)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>У вас нет ни одного объявления.</p>
                )}
            </div>

            {/* Edit Ad Form */}
            {editAd && (
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Редактировать объявление</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-gray-700">Название</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-gray-700">Цена</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="type_of_transaction" className="block text-gray-700">Тип сделки</label>
                                <input
                                    type="text"
                                    id="type_of_transaction"
                                    name="type_of_transaction"
                                    value={formData.type_of_transaction}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="type_of_housing" className="block text-gray-700">Тип жилья</label>
                                <input
                                    type="text"
                                    id="type_of_housing"
                                    name="type_of_housing"
                                    value={formData.type_of_housing}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-gray-700">Описание</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-gray-700">Адрес</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="number_of_rooms" className="block text-gray-700">Количество комнат</label>
                                <input
                                    type="number"
                                    id="number_of_rooms"
                                    name="number_of_rooms"
                                    value={formData.number_of_rooms}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label htmlFor="square" className="block text-gray-700">Площадь (м²)</label>
                                <input
                                    type="number"
                                    id="square"
                                    name="square"
                                    value={formData.square}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label htmlFor="year_of_construction" className="block text-gray-700">Год постройки</label>
                                <input
                                    type="number"
                                    id="year_of_construction"
                                    name="year_of_construction"
                                    value={formData.year_of_construction}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label htmlFor="floor" className="block text-gray-700">Этаж</label>
                                <input
                                    type="number"
                                    id="floor"
                                    name="floor"
                                    value={formData.floor}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label htmlFor="ceiling_height" className="block text-gray-700">Высота потолков</label>
                                <input
                                    type="number"
                                    id="ceiling_height"
                                    name="ceiling_height"
                                    value={formData.ceiling_height}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="balcony"
                                    name="balcony"
                                    checked={formData.balcony}
                                    onChange={handleCheckboxChange}
                                    className="mr-2"
                                />
                                <label htmlFor="balcony" className="text-gray-700">Балкон</label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="internet"
                                    name="internet"
                                    checked={formData.internet}
                                    onChange={handleCheckboxChange}
                                    className="mr-2"
                                />
                                <label htmlFor="internet" className="text-gray-700">Интернет</label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="elevator"
                                    name="elevator"
                                    checked={formData.elevator}
                                    onChange={handleCheckboxChange}
                                    className="mr-2"
                                />
                                <label htmlFor="elevator" className="text-gray-700">Лифт</label>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                                >
                                    Сохранить изменения
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
