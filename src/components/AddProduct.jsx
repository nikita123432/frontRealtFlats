// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Upload, message, Space } from 'antd';
import axios from 'axios';

const { TextArea } = Input;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const HomeForm = () => {
    const [componentDisabled] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);  // Состояние для авторизации

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Retrieved token:', token); // Для проверки
        if (token) {
            setIsAuthenticated(true); // Если токен есть, считаем, что пользователь авторизован
        } else {
            setIsAuthenticated(false); // Если токена нет, считаем, что пользователь не авторизован
            message.warning('You are not logged in. Please log in to continue.');
            history.push('/login'); // Перенаправляем на страницу логина
        }
    }, [history]);

    const onFinish = (values) => {
        const payload = new FormData();
        payload.append('name', values.name);
        payload.append('price', values.price);
        payload.append('description', values.description);
        payload.append('address', values.address);
        payload.append('type_of_transaction', values.type_of_transaction);
        payload.append('type_of_housing', values.type_of_housing);

        // Добавление отдельных опций
        payload.append('home_id', values.homeId);
        payload.append('number_of_rooms', values.number_of_rooms);
        payload.append('square', values.square);
        payload.append('year_of_construction', values.year_of_construction);
        payload.append('floor', values.floor);
        payload.append('ceiling_height', values.ceiling_height);
        payload.append('balcony', values.balcony);
        payload.append('internet', values.internet);
        payload.append('elevator', values.elevator);

        // Добавление всех фотографий
        values.photo?.forEach(file => {
            payload.append('photos', file.originFileObj); // Отправляем каждую фотографию
        });

        const token = localStorage.getItem("token"); // Получение токена

        if (!token) {
            message.error("Token is missing. Please login again.");
            return;
        }

        axios.post('http://127.0.0.1:8000/operations/add-real-estate/', payload, {
            headers: {
                Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                console.log('Данные успешно отправлены:', response.data);
                message.success('Product added successfully!');
            })
            .catch(error => {
                console.error('Ошибка при отправке данных:', error.response?.data || error.message);
                message.error(error.response?.data?.detail || 'Failed to add product');
            });
    };

    return (
        <>
            {isAuthenticated ? (
                <Form
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    layout="vertical"
                    disabled={componentDisabled}
                    style={{
                        maxWidth: 700,
                        margin: '0 auto',
                        padding: '30px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'rgba(143,140,140,0.44)',
                        fontWeight: "bold"
                    }}
                    onFinish={onFinish}
                >
                    <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Добавить Недвижимость</h2>

                    <Form.Item
                        label="Название"
                        name="name"
                        rules={[{ required: true, message: 'Пожалуйста, введите название!' }]}>
                        <Input placeholder="Введите название недвижимости" />
                    </Form.Item>

                    <Form.Item
                        label="Цена"
                        name="price"
                        rules={[{ required: true, message: 'Пожалуйста, введите цену!' }]}>
                        <Input placeholder="Введите цену" type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Описание"
                        name="description"
                        rules={[{ required: true, message: 'Пожалуйста, введите описание!' }]}>
                        <TextArea placeholder="Введите описание недвижимости" rows={4} />
                    </Form.Item>

                    <Form.Item
                        label="Адрес"
                        name="address"
                        rules={[{ required: true, message: 'Пожалуйста, введите адрес!' }]}>
                        <Input placeholder="Введите адрес" />
                    </Form.Item>

                    <Form.Item
                        label="Тип сделки"
                        name="type_of_transaction"
                        rules={[{ required: true, message: 'Пожалуйста, выберите тип сделки!' }]}>
                        <Select placeholder="Выберите тип сделки">
                            <Select.Option value="sale">Продажа</Select.Option>
                            <Select.Option value="rent">Аренда</Select.Option>
                            <Select.Option value="daily">Посуточная аренда</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Тип недвижимости"
                        name="type_of_housing"
                        rules={[{ required: true, message: 'Пожалуйста, выберите тип недвижимости!' }]}>
                        <Select placeholder="Выберите тип недвижимости">
                            <Select.Option value="apartment">Квартира</Select.Option>
                            <Select.Option value="room">Комната</Select.Option>
                            <Select.Option value="plot">Земельный участок</Select.Option>
                            <Select.Option value="office">Офис</Select.Option>
                            <Select.Option value="commercial">Торговое помещение</Select.Option>
                            <Select.Option value="warehouse">Склад</Select.Option>
                            <Select.Option value="house">Дом</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Количество комнат"
                        name="number_of_rooms"
                        rules={[{ required: true, message: 'Пожалуйста, введите количество комнат!' }]}>
                        <Input placeholder="Введите количество комнат" type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Площадь"
                        name="square"
                        rules={[{ required: true, message: 'Пожалуйста, введите площадь!' }]}>
                        <Input placeholder="Введите площадь" type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Год постройки"
                        name="year_of_construction"
                        rules={[{ required: true, message: 'Пожалуйста, введите год постройки!' }]}>
                        <Input placeholder="Введите год постройки" type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Этаж"
                        name="floor"
                        rules={[{ required: true, message: 'Пожалуйста, введите этаж!' }]}>
                        <Input placeholder="Введите этаж" type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Высота потолков"
                        name="ceiling_height"
                        rules={[{ required: true, message: 'Пожалуйста, введите высоту потолков!' }]}>
                        <Input placeholder="Введите высоту потолков" type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Балкон"
                        name="balcony"
                        rules={[{ required: true, message: 'Пожалуйста, укажите наличие балкона!' }]}>
                        <Select placeholder="Выберите наличие балкона">
                            <Select.Option value="yes">Есть</Select.Option>
                            <Select.Option value="no">Нет</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Интернет"
                        name="internet"
                        rules={[{ required: true, message: 'Пожалуйста, укажите наличие интернета!' }]}>
                        <Select placeholder="Выберите наличие интернета">
                            <Select.Option value="yes">Есть</Select.Option>
                            <Select.Option value="no">Нет</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Лифт"
                        name="elevator"
                        rules={[{ required: true, message: 'Пожалуйста, укажите наличие лифта!' }]}>
                        <Select placeholder="Выберите наличие лифта">
                            <Select.Option value="yes">Есть</Select.Option>
                            <Select.Option value="no">Нет</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Фото"
                        name="photo"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}>
                        <Upload
                            action="http://127.0.0.1:8000/operations/add-real-estate/"
                            listType="picture-card"
                            method="POST">
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Загрузить</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Space>
                            <Button type="primary" htmlType="submit" style={{ width: '200px' }}>
                                Добавить
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    <p>Вы должны быть авторизованы, чтобы добавить недвижимость. Пожалуйста, войдите в систему.</p>
                </div>
            )}
        </>
    );
};

export default HomeForm;
