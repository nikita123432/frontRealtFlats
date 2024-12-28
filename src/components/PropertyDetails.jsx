import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';


const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [coordinates, setCoordinates] = useState(null);
    const [apiLoaded, setApiLoaded] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // Для текущей фотографии
    const mapRef = useRef(null);
    const [userLoading, setUserLoading] = useState(true); // Добавим состояние загрузки для пользователя
    const [userError, setUserError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [similarProperties, setSimilarProperties] = useState([]);
    const [priceRangePercentage] = useState(10);



    // Маппинг для перевода ключей опций на русский
    const optionLabels = {
        numbers_of_room: 'Количество комнат',
        square: 'Площадь (м²)',
        year_of_construction: 'Год постройки',
        floor: 'Этаж',
        ceiling_height: 'Высота потолков',
        balcony: 'Балкон',
        internet: 'Интернет',
        elevator: 'Лифт'
    };

    // Функция для замены yes/no на "есть"/"нет"






    useEffect(() => {
        setLoading(true);
        setError(null);

        axios
            .get(`http://127.0.0.1:8000/operations/items/${id}`)
            .then((response) => {
                const data = response.data;

                const propertyDetails = {
                    id: data.id,
                    name: data.name,
                    price: data.price,
                    description: data.description,
                    options: data.options,
                    address: data.address,
                    photos: data.photos,
                    type: data.type_of_transaction,
                    housing: data.type_of_housing,
                    rooms: data.number_of_rooms,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    user_id: data.user_id
                };

                setProperty(propertyDetails);
                setCoordinates({
                    lat: data.latitude,
                    lng: data.longitude,
                });
                setLoading(false);
                getUser(data.user_id);
                console.log(data.user_id)
            })
            .catch((err) => {
                setError('Ошибка при получении данных');
                setLoading(false);
                console.error(err);
            });
    }, [id]);

    const getSimilarProperties = async (announcementId, priceRangePercentage) => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/operations/announcements/${announcementId}/similar_by_price`,
                { params: { price_range_percentage: priceRangePercentage } }
            );
            setSimilarProperties(response.data); // Сохраняем данные похожих объявлений
        } catch (error) {
            console.error('Ошибка при получении похожих объявлений:', error);
        }
    };

    useEffect(() => {
        if (id) {
            getSimilarProperties(id, priceRangePercentage); // Запрашиваем похожие объявления
        }
    }, [id, priceRangePercentage]); // Перезапускать запрос при изменении id или priceRangePercentage

    useEffect(() => {
        const getPhotos = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/operations/get-photo/${id}`);
                const updatedPhotos = response.data.map((photo) => {
                    return {
                        ...photo,
                        path: `http://127.0.0.1:8000/operations/get-photo/${id}/${photo.photo}`,
                    };
                });
                console.log('Обновленные фотографии:', updatedPhotos);  // Логируем итоговые данные
                setPhotos(updatedPhotos);
            } catch (err) {
                console.error('Ошибка при получении фотографий', err);
            }
        };

        if (id) {
            getPhotos();
        }
    }, [id]);


    const getUser = async (user_id) => {
        setUserLoading(true); // Начинаем загрузку данных пользователя
        try {
            const response = await axios.get(`http://127.0.0.1:8000/operations/users/${user_id}`);
            setUser(response.data);
            setUserLoading(false); // Данные пользователя загружены
        } catch (err) {
            setUserError('Ошибка при получении данных пользователя');
            setUserLoading(false); // Завершаем загрузку
            console.error('Ошибка при получении данных пользователя', err);
        }
    };

    useEffect(() => {
        if (window.ymaps) {
            setApiLoaded(true);
        } else {
            const script = document.createElement('script');
            script.src = 'https://api-maps.yandex.ru/2.1/?apikey=dad88f6c-dba8-4a6b-8a3f-c08810043cb8&lang=ru_RU';
            script.onload = () => setApiLoaded(true);
            document.head.appendChild(script);
        }
    }, []);

    useEffect(() => {
        if (apiLoaded && coordinates && mapRef.current) {
            const existingMap = mapRef.current.__ymapsMap;
            if (existingMap) {
                existingMap.setCenter([coordinates.lat, coordinates.lng]);
                existingMap.setZoom(15);
            } else {
                window.ymaps.ready(() => {
                    const map = new window.ymaps.Map(mapRef.current, {
                        center: [coordinates.lat, coordinates.lng],
                        zoom: 15,
                    });

                    const placemark = new window.ymaps.Placemark([coordinates.lat, coordinates.lng], {
                        balloonContent: `<strong>${property.name}</strong><br>${property.address}`,
                    });

                    map.geoObjects.add(placemark);
                    mapRef.current.__ymapsMap = map;
                });
            }
        }
    }, [apiLoaded, coordinates, property]);

    const goToNextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    };

    const goToPreviousPhoto = () => {
        setCurrentPhotoIndex(
            (prevIndex) => (prevIndex - 1 + photos.length) % photos.length
        );
    };

    const goToUserProfile = () => {
        if (user && user.id) {
            navigate(`/user/${user.id}/properties`); // Перенаправляем на страницу с объявлениями пользователя
        }
    };

    const goToChat = () => {
        if (user && user.id) {
            navigate(`/chat/${user.id}`); // Перенаправляем на страницу чата с создателем объявления
        }
    };


    const renderMap = () => {
        if (!coordinates) return null;
        return <div ref={mapRef} style={{ width: '1500px', height: '500px', marginLeft: '174px' }}></div>;
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;



    return (
        <div className="p-6 flex flex-col gap-6 bg-gray-100"> {/* Фон за карточками */}
            <div className="flex gap-6">
                <div
                    className="flex flex-col items-center border p-4 rounded-md bg-white w-[700px] h-[700px] ml-40">

                    <h1 className="text-2xl font-bold mb-4 text-black">{property.name}</h1>
                    {photos.length > 0 ? (
                        <div className="relative w-full h-full">
                            <img
                                src={photos[currentPhotoIndex].path}
                                alt={photos[currentPhotoIndex].photo || `Фото ${currentPhotoIndex + 1}`}
                                className="w-full h-full object-cover rounded-md"
                            />
                            <div className="absolute top-1/2 left-0 right-0 flex justify-between">
                                <button
                                    onClick={goToPreviousPhoto}
                                    className="bg-black text-white p-2"
                                >
                                    &lt;
                                </button>
                                <button
                                    onClick={goToNextPhoto}
                                    className="bg-black text-white p-2"
                                >
                                    &gt;
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>Фотографии не найдены</p>
                    )}
                </div>

                <div className="flex-1 border p-4  rounded-md bg-white mr-24">
                    <div className="text-right">
                        <p className="text-lg font-bold text-black"><strong>Цена:</strong> {property.price} р./мес.</p>
                        <p className="text-lg font-bold text-black"><strong>Адрес:</strong> {property.address}</p>
                        {/*<button className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-md">Показать контакт</button>*/}
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center justify-between">
                            <p className="text-lg text-black">Описание</p>
                            <button
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                className="text-black flex items-center"
                            >
                                {isDescriptionExpanded ? (
                                    <><FaChevronDown className="mr-2"/> Показать меньше</>
                                ) : (
                                    <><FaChevronRight className="mr-2"/> Показать больше</>
                                )}
                            </button>
                        </div>

                        <p
                            className={`text-lg text-black mt-2 ${isDescriptionExpanded ? 'block' : 'line-clamp-4'}`}
                        >
                            {property.description}
                        </p>

                    </div>

                    {/* Данные пользователя */}
                    {userLoading ? (
                        <p>Загрузка данных пользователя...</p>
                    ) : userError ? (
                        <p>{userError}</p>
                    ) : (
                        user && (
                            <div className="mt-4">
                                <p className="text-black">Имя: {user.username}</p>
                                <p className="text-black">Email: {user.email}</p>
                                {/* Добавьте другие поля пользователя по желанию */}
                            </div>
                        )
                    )}
                    {/* Кнопка перехода на страницу пользователя */}
                    <div className="mt-6">
                        <button
                            onClick={goToUserProfile}
                            className="w-full bg-blue-500 text-white p-4 rounded-md hover:bg-blue-600"
                        >
                            Профиль пользователя
                        </button>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={goToChat} // Используем новую функцию
                            className="w-full bg-blue-500 text-white p-4 rounded-md hover:bg-blue-600"
                        >
                            Написать
                        </button>
                    </div>
                    <div className="mt-24">
                        <h3 className="text-lg font-semibold text-black">Параметры объекта</h3>
                        <ul className="text-black mt-2"> {/* Отступ между заголовком и списком */}
                            {property.options && Object.entries(property.options).map(([key, value]) => {
                                const label = optionLabels[key] || key; // Получаем метку с маппинга или сам ключ

                                // Заменяем "yes" на "Есть" и "no" на "Нет"
                                if (value === 'yes') value = 'Есть';
                                if (value === 'no') value = 'Нет';
                                if (value === 'true') value = 'Есть';
                                if (value === 'false') value = 'Нет';

                                // Количество подчеркиваний для выравнивания
                                const underscores = ' _ '.repeat(30 - label.length);

                                return (
                                    <li key={key} className="flex items-baseline">
                                        <span className="font-semibold">{label}:</span>
                                        <span className="ml-2 text-left">{underscores}{value}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                </div>
            </div>
            <div className="ml-30">

                {renderMap()}
            </div>


            <div className="mt-10">
                <h2 className="text-2xl font-bold text-black">Похожие объявления</h2>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {similarProperties.length === 0 ? (
                        <p>Нет похожих объявлений</p>
                    ) : (
                        similarProperties.map((similarProperty) => (
                            <div
                                key={similarProperty.id}
                                className="bg-white p-4 rounded-md shadow-lg"
                            >
                                <h3 className="font-bold text-lg">{similarProperty.name}</h3>
                                <p>{similarProperty.address}</p>
                                <p>Цена: {similarProperty.price} р./мес.</p>
                            </div>
                        ))
                    )}
                </div>
            </div>


        </div>
    );
};

export default PropertyDetails;
