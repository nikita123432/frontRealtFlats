// PropertyDetails.js
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const PropertyDetails = () => {
    const { id } = useParams(); // Получаем id недвижимости из URL
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);  // Устанавливаем загрузку в true при начале запроса
        setError(null);    // Сбрасываем ошибку

        axios.get(`http://127.0.0.1:8000/operations/items/${id}`)
            .then(response => {
                setProperty(response.data);
                setLoading(false);  // Устанавливаем загрузку в false, когда данные пришли
            })
            .catch(err => {
                setError('Ошибка при получении данных');
                setLoading(false);
                console.error(err);
            });
    }, [id]);

    if (loading) return <div>Загрузка...</div>;  // Показываем сообщение, если данные еще загружаются
    if (error) return <div>{error}</div>;  // Показываем ошибку, если она произошла

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">{property.name}</h1>
            <img
                src={`http://127.0.0.1:8000/${property.photo}`}
                alt={property.name}
                className="object-cover w-full h-64 rounded-md mb-4"
            />
            <p className="text-lg">{property.description}</p>
            <p><strong>Цена:</strong> {property.price} р./мес.</p>
            <p><strong>Адрес:</strong> {property.address}</p>
            <p><strong>Опции:</strong> {property.options}</p>
        </div>
    );
};

export default PropertyDetails;
