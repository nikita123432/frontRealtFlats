import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserProfileWithAds = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [properties, setProperties] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [averagePrice, setAveragePrice] = useState(null);  // Состояние для хранения средней цены

    // Загружаем информацию о пользователе и его объявлениях
    useEffect(() => {
        setLoading(true);
        setError(null);

        // Получаем информацию о пользователе
        axios
            .get(`http://127.0.0.1:8000/operations/users/${userId}`)
            .then((response) => {
                setUser(response.data);
            })
            .catch((err) => {
                setError('Ошибка при получении данных пользователя');
                console.error(err);
            });

        // Получаем все объявления пользователя
        axios
            .get(`http://127.0.0.1:8000/operations/itemsbyid/?user_id=${userId}`)
            .then((response) => {
                const propertiesData = response.data;
                setProperties(propertiesData);

                // Рассчитываем среднюю цену всех объявлений
                const prices = propertiesData.map((property) => parseFloat(property.price));
                const totalPrice = prices.reduce((sum, price) => sum + price, 0);
                const average = prices.length > 0 ? totalPrice / prices.length : null;
                setAveragePrice(average);  // Устанавливаем среднюю цену
            })
            .catch((err) => {
                setError('Ошибка при получении объявлений');
                console.error(err);
            });

        // Получаем отзывы о пользователе
        axios
            .get(`http://127.0.0.1:8000/operations/reviews/${userId}`)
            .then((response) => {
                setReviews(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError('Ошибка при получении отзывов');
                setLoading(false);
                console.error(err);
            });

    }, [userId]);

    // Обработка отправки нового отзыва
    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (newReview.trim()) {
            axios
                .post(`http://127.0.0.1:8000/operations/reviews/`, {
                    user_id: userId,
                    text: newReview,
                })
                .then((response) => {
                    setReviews([...reviews, response.data]); // Добавляем новый отзыв в список
                    setNewReview(''); // Очищаем поле ввода
                })
                .catch((err) => {
                    console.error('Ошибка при добавлении отзыва:', err);
                });
        }
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-6">
            {user && (
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Профиль пользователя: {user.name}</h1>
                    <p className="text-lg">Email: {user.email}</p>
                    <p className="text-lg">Телефон: {user.phone}</p>
                </div>
            )}

            <h2 className="text-2xl font-semibold mb-4">Объявления пользователя</h2>
            {properties.length > 0 ? (
                <div className="space-y-4">
                    {properties.map((property) => (
                        <div key={property.id} className="bg-white p-4 rounded-md shadow-md mb-4">
                            <h3 className="text-xl font-semibold">{property.name}</h3>
                            <p className="text-lg">Цена: {property.price} р./мес.</p>
                            <p className="text-md">Адрес: {property.address}</p>
                            <p className="text-sm text-gray-600">{property.description}</p>
                        </div>
                    ))}
                    {averagePrice !== null && (
                        <div className="mt-4 text-lg font-semibold">
                            Средняя цена: {averagePrice.toFixed(2)} р.
                        </div>
                    )}
                </div>
            ) : (
                <div>У этого пользователя нет объявлений.</div>
            )}

            <h2 className="text-2xl font-semibold mt-8 mb-4">Отзывы</h2>
            <div className="space-y-4">
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="bg-gray-100 p-3 rounded-md">
                            <p className="text-gray-800">{review.text}</p>
                        </div>
                    ))
                ) : (
                    <div className="bg-gray-100 p-3 rounded-md text-center text-gray-600">
                        Отзывов пока нет. Будьте первым!
                    </div>
                )}
            </div>

            <form onSubmit={handleReviewSubmit} className="mt-4">
                <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Оставьте свой отзыв..."
                    rows="4"
                ></textarea>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-2"
                >
                    Отправить
                </button>
            </form>
        </div>
    );
};

export default UserProfileWithAds;
