// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Upload, message } from 'antd';
import axios from 'axios';
;

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
        payload.append('options', values.options || '');
        payload.append('address', values.address);
        payload.append('type_of_transaction', values.type_of_transaction);
        payload.append('type_of_housing', values.type_of_housing);
        payload.append('number_of_rooms', values.number_of_rooms);
        payload.append('photo', values.photo?.[0]?.originFileObj || null); // Отправляем сам файл

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
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    disabled={componentDisabled}
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please input the price!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input the description!' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        label="Options"
                        name="options"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please input the address!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Type of Transaction"
                        name="type_of_transaction"
                        rules={[{ required: true, message: 'Please select the transaction type!' }]}
                    >
                        <Select>
                            <Select.Option value="sale">Продать</Select.Option>
                            <Select.Option value="rent">Сдать в аренду</Select.Option>
                            <Select.Option value="daily">Сдать посуточно</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Type of Housing"
                        name="type_of_housing"
                        rules={[{ required: true, message: 'Please select the housing type!' }]}
                    >
                        <Select>
                            <Select.Option value="apartment">Квартира</Select.Option>
                            <Select.Option value="room">Комната</Select.Option>
                            <Select.Option value="plot">Земельный участок</Select.Option>
                            <Select.Option value="office">Офис</Select.Option>
                            <Select.Option value="commercial">Торговоее помещение</Select.Option>
                            <Select.Option value="warehouse">Склад</Select.Option>
                            <Select.Option value="house">Дом</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Number of Rooms"
                        name="number_of_rooms"
                        rules={[{ required: true, message: 'Please input the number of rooms!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Photo"
                        name="photo"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Upload action="http://127.0.0.1:8000/operations/add-real-estate/" listType="picture-card" method="POST">
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            ) : (
                <p>You must be logged in to add a product. Please register or log in.</p>
            )}
        </>
    );
};

export default HomeForm;
