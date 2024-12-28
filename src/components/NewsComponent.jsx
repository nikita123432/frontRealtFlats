// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';

const NewsComponent = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/operations/news');
                if (!response.ok) {
                    throw new Error('Failed to fetch news');
                }
                const data = await response.json();
                setNews(data.news); // Assuming 'news' is the key with the array of news
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) {
        return <div className="text-center text-xl text-gray-600">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-xl text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Latest News</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((item, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h2>
                        <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-56 object-cover rounded-lg mb-4"
                        />
                        <div className="text-sm text-gray-500 mb-4">
                            <p><strong>Date:</strong> {item.date}</p>
                            <p><strong>Views:</strong> {item.views}</p>
                        </div>
                        <p className="text-gray-700">{item.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsComponent;
