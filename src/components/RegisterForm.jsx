// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import {useNavigate} from "react-router-dom";



const App = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/register', {
                username: values.username,
                email: values.email,
                phone_number: values.phone_number,
                password: values.password,
                role_id: values.role_id || 0, // передаем роль (по умолчанию 0)
                is_active: values.is_active !== undefined ? values.is_active : true, // по умолчанию true
                is_superuser: values.is_superuser !== undefined ? values.is_superuser : false, // по умолчанию false
                is_verified: values.is_verified !== undefined ? values.is_verified : false, // по умолчанию false
            });
            message.success('Form submitted successfully!');
            console.log('Response:', response.data);
            navigate('/login'); // Перенаправление после успешной регистрации
        } catch (error) {
            if (error.response && error.response.data) {
                const details = error.response.data.detail;
                if (Array.isArray(details)) {
                    const errorMessage = details.map((d) => d.msg).join(', ');
                    message.error(`Validation error: ${errorMessage}`);
                } else {
                    message.error('An unexpected error occurred');
                }
            } else {
                message.error('Failed to submit the form');
            }
            console.error('Error details:', error);
        }
    };





    const onFinishFailed = (errorInfo) => {
        console.log('Validation Failed:', errorInfo);
    };

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[
                    {
                        required: true,
                        type: 'email',
                        message: 'Please input a valid email!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
            </Form.Item>


        </Form>

    );
};

export default App;
