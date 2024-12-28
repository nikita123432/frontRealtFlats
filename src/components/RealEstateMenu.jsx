// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Card, Select, Input, Button, Form, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Функция для получения URL фотографии, используя только homeId

const PropertyFilter = () => {
    const [estate, setEstate] = useState([]);
    const [transactionType, setTransactionType] = useState('');
    const [housingType, setHousingType] = useState('');
    const [numberOfRooms, setNumberOfRooms] = useState('');
    const [photos, setPhotos] = useState({}); // Храним фотографии для каждой недвижимости

    // Функция для получения недвижимости
    const fetchRealEstate = () => {
        axios
            .get('http://127.0.0.1:8000/operations/items')
            .then((response) => {
                const realEstate = response.data;

                // Преобразуем данные для отображения
                const menuItems = realEstate.map((c, index) => ({
                    key: index,
                    id: c.id,
                    homeId: c.home_id,  // Сохраняем home_id для связки с фотографиями
                    name: c.name,
                    price: c.price,
                    description: c.description,
                    options: c.options,
                    address: c.address,
                    type: c.type_of_transaction,
                    housing: c.type_of_housing,
                    rooms: c.number_of_rooms,
                }));

                setEstate(menuItems);
                menuItems.forEach(item => {
                    // Для каждого элемента недвижимости получаем фотографии
                    getPhotos(item.id);
                });
            })
            .catch((error) => {
                console.error('Ошибка при получении данных:', error);
            });
    };

    // Функция для получения фотографий по homeId

        const getPhotos = async (homeId) => {

            console.log(homeId); // Логируем homeId
            try {
                const response = await axios.get(`http://127.0.0.1:8000/operations/get-photo/${homeId}`);
                console.log('Полученные фотографии:', response.data);  // Логируем полученные данные
                const updatedPhotos = response.data.map((photo) => {
                    return {
                        photo: photo.photo,
                        path: `http://127.0.0.1:8000/operations/get-photo/${homeId}/${photo.photo}`

                    };

                });
                console.log('Обновленные фотографии:', updatedPhotos);  // Логируем итоговые данные
                setPhotos((prevState) => ({
                    ...prevState,
                    [homeId]: updatedPhotos, // Сохраняем фотографии для конкретного homeId

                }));
                console.log(updatedPhotos)
            } catch (err) {
                console.error('Ошибка при получении фотографий', err);
            }
        };

    // Функция для добавления в избранное
    const addToFavorites = async (homeId) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/operations/favorites/', {
                home_id: homeId,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Используйте токен из хранилища
                }
            });

            if (response.status === 200) {
                message.success('Недвижимость добавлена в избранное');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                message.error('Эта недвижимость уже в избранном');
            } else {
                message.error('Ошибка при добавлении в избранное');
            }
        }
    };

    useEffect(() => {
        fetchRealEstate();
    }, []);

    const filteredProperties = estate.filter((property) => {
        return (
            (transactionType ? property.type === transactionType : true) &&
            (housingType ? property.housing === housingType : true) &&
            (numberOfRooms ? property.rooms === Number(numberOfRooms) : true)
        );
    });

    return (
        <div className="p-6 flex flex-col items-center justify-center min-h-screen">
            <Form layout="inline" className="mb-6 flex flex-wrap justify-center space-x-29">
                <Form.Item label="Тип сделки ">

                    <Select
                        onChange={(value) => setTransactionType(value)}
                        value={transactionType}
                        allowClear
                        style={{ width: 'auto' }}
                        className="max-w-full"
                    >
                        <Select.Option value="sale">Продать</Select.Option>
                        <Select.Option value="rent">Сдать в аренду</Select.Option>
                        <Select.Option value="daily">Сдать посуточно</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Тип недвижимости">
                    <Select
                        onChange={(value) => setHousingType(value)}
                        value={housingType}
                        allowClear
                        className="w-64"
                    >
                        <Select.Option value="apartment">Квартира</Select.Option>
                        <Select.Option value="room">Комната</Select.Option>
                        <Select.Option value="plot">Земельный участок</Select.Option>
                        <Select.Option value="office">Офис</Select.Option>
                        <Select.Option value="commercial">Торговое помещение</Select.Option>
                        <Select.Option value="warehouse">Склад</Select.Option>
                        <Select.Option value="house">Дом</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Количество комнат">
                    <Input
                        onChange={(e) => setNumberOfRooms(e.target.value)}
                        value={numberOfRooms}
                        className="w-48"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" onClick={() => fetchRealEstate()}>
                        Применить фильтр
                    </Button>
                </Form.Item>
            </Form>

            <div className="flex flex-col items-center w-full space-y-6">
                {filteredProperties.map((item) => (
                    <Link to={`/property/${item.id}`} key={item.key} className="w-full max-w-2xl">
                        <Card
                            className="p-4 shadow-md border border-gray-300 rounded-lg bg-white"
                            hoverable
                        >
                            <div className="flex flex-col items-start">
                                <div className="w-full flex justify-between mb-4">
                                    <span className="text-yellow-500 font-bold text-lg">{item.price} р.</span>
                                </div>
                                <div className="w-full mb-4">
                                    {photos[item.homeId] && photos[item.homeId].length > 0 ? (
                                        <div className="photos">
                                            {photos[item.homeId].map((photo, idx) => {
                                                console.log(photo);  // Логируем каждое фото
                                                return (
                                                    <div key={idx} className="photo-container">
                                                        <img
                                                            src={photo.path}  // Используем сформированный путь
                                                            alt={photo.photo}
                                                            className="photo"
                                                        />
                                                        {photo.photo && <p>{photo.photo}</p>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="bg-gray-200 w-full h-48 rounded-md">
                                            <p>Нет фотографий</p>
                                        </div>
                                    )}
                                </div>


                                <h3 className="font-bold text-xl text-gray-800 mb-2">{item.name}</h3>
                                <div className="text-gray-600 text-sm space-y-2">
                                    <p className="line-clamp-2">{item.description}</p>
                                    <p>Адрес: {item.address}</p>
                                </div>
                                <div className="flex justify-between mt-4 w-full">

                                    <Button
                                        type="primary"
                                        onClick={() => addToFavorites(item.id)} // Передаем ID объекта
                                        style={{marginTop: '10px'}}
                                    >
                                        Добавить в избранное
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PropertyFilter;
