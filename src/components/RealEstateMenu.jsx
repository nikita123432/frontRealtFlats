import { Card, Select, Input, Button, Form } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const PropertyFilter = () => {
    const [estate, setEstate] = useState([]);
    const [transactionType, setTransactionType] = useState('');
    const [housingType, setHousingType] = useState('');
    const [numberOfRooms, setNumberOfRooms] = useState('');

    const fetchRealEstate = () => {
        axios.get('http://127.0.0.1:8000/operations/items')
            .then(response => {
                const realEstate = response.data;
                const menuItems = realEstate.map((c, index) => ({
                    key: index,
                    id: c.Home.id, // Используем уникальный ID
                    name: c.Home.name,
                    price: c.Home.price,
                    description: c.Home.description,
                    options: c.Home.options,
                    address: c.Home.address,
                    photo: `http://127.0.0.1:8000/${c.Home.photo}`,
                    type: c.Home.type_of_transaction,
                    housing: c.Home.type_of_housing,
                    rooms: c.Home.number_of_rooms
                }));
                setEstate(menuItems);
            })
            .catch(error => {
                console.error('Ошибка при получении данных:', error);
            });
    };

    useEffect(() => {
        fetchRealEstate();
    }, []);

    const filteredProperties = estate.filter(property => {
        return (
            (transactionType ? property.type === transactionType : true) &&
            (housingType ? property.housing === housingType : true) &&
            (numberOfRooms ? property.rooms === Number(numberOfRooms) : true)
        );
    });

    return (
        <div className="p-6 flex flex-col items-center justify-center min-h-screen">
            <Form layout="inline" className="mb-6 flex flex-wrap justify-center space-x-29">
                <Form.Item label="Type of Transaction">
                    <Select
                        onChange={(value) => setTransactionType(value)}
                        value={transactionType}
                        allowClear
                        className="w-48"
                    >
                        <Select.Option value="sale">Продать</Select.Option>
                        <Select.Option value="rent">Сдать в аренду</Select.Option>
                        <Select.Option value="daily">Сдать посуточно</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Type of Housing">
                    <Select
                        onChange={(value) => setHousingType(value)}
                        value={housingType}
                        allowClear
                        className="w-48"
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

                <Form.Item label="Number of Rooms">
                    <Input
                        onChange={(e) => setNumberOfRooms(e.target.value)}
                        value={numberOfRooms}
                        className="w-48"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" onClick={() => fetchRealEstate()}>
                        Apply Filters
                    </Button>
                </Form.Item>
            </Form>

            <div className="flex flex-col items-center w-full space-y-6">
                {filteredProperties.map(item => (
                    <Link to={`/property/${item.id}`} key={item.key} className="w-full max-w-2xl">
                        <Card
                            className="p-4 shadow-md border border-gray-300 rounded-lg bg-white"
                            hoverable
                        >
                            <div className="flex flex-col items-start">
                                <div className="w-full flex justify-between mb-4">
                                    <span className="text-yellow-500 font-bold text-lg">{item.price} р./мес.</span>
                                    <span className="text-gray-500 text-sm">🔥</span>
                                </div>
                                <div className="w-full mb-4">
                                    {item.photo ? (
                                        <img
                                            alt={item.name}
                                            src={item.photo}
                                            className="object-cover w-full h-48 rounded-md"
                                        />
                                    ) : (
                                        <div className="bg-gray-200 w-full h-48 rounded-md"/>
                                    )}
                                </div>
                                <h3 className="font-bold text-xl text-gray-800 mb-2">{item.name}</h3>
                                <div className="text-gray-600 text-sm space-y-2">
                                    <p>{item.description}</p>
                                    <p>Опции: {item.options}</p>
                                    <p>Адрес: {item.address}</p>
                                </div>
                                <div className="flex justify-between mt-4 w-full">
                                    <Button type="primary" className="mr-2 w-full">
                                        Контакты
                                    </Button>
                                    <Button className="w-full" ghost>
                                        Написать
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
