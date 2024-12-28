// import { Card, Button, message } from "antd";
// import axios from "axios";
// import { useEffect, useState } from "react";
//
// function RealEstateCard() {
//     const [estate, setEstate] = useState([]);
//
//     // Функция для загрузки недвижимости
//     const fetchRealEstate = () => {
//         axios.get('http://127.0.0.1:8000/operations/items')
//             .then(response => {
//                 const realEstate = response.data;
//                 const menuItems = realEstate.map((c, index) => ({
//                     key: index,
//                     id: c.Home.id,  // Добавим id для идентификации объекта
//                     name: c.Home.name,
//                     price: c.Home.price,
//                     description: c.Home.description,
//                     options: c.Home.options,
//                     address: c.Home.address,
//                     photo: `http://127.0.0.1:8000/${c.Home.photo}`
//                 }));
//                 setEstate(menuItems);
//             })
//             .catch(error => {
//                 console.error('Ошибка при получении данных:', error);
//             });
//     };
//
//     // Функция для добавления объекта в избранное
//     const addToFavorites = (homeId) => {
//         const userId = localStorage.getItem('userId'); // Получаем ID пользователя (например, из локального хранилища)
//
//         axios.post(`http://127.0.0.1:8000/operations/favorites/?user_id=${userId}&home_id=${homeId}`)
//             .then(() => {
//                 message.success("Добавлено в избранное!");
//             })
//             .catch(error => {
//                 console.error("Ошибка при добавлении в избранное:", error);
//                 message.error(error.response?.data?.detail || "Не удалось добавить в избранное");
//             });
//     };
//
//     useEffect(() => {
//         fetchRealEstate();
//     }, []);
//
//     return (
//         <div className="flex flex-col items-center justify-center space-y-6">
//             {estate.map(item => (
//                 <Card
//                     key={item.key}
//                     className="w-full max-w-2xl p-6" // Увеличиваем ширину карточки
//                     hoverable
//                 >
//                     <div className="flex items-start space-x-6"> {/* Горизонтальная компоновка */}
//                         {/* Изображение слева */}
//                         <div className="w-1/3">
//                             {item.photo ? (
//                                 <img
//                                     alt={item.name}
//                                     src={item.photo}
//                                     className="object-cover w-full h-full rounded-md"
//                                 />
//                             ) : (
//                                 <div className="bg-gray-200 w-full h-60 rounded-md" />
//                             )}
//                         </div>
//
//                         {/* Текст справа */}
//                         <div className="flex flex-col w-2/3 space-y-2">
//                             <h3 className="font-bold text-xl">{item.name}</h3>
//                             <p className="text-gray-700 text-lg">Цена: {item.price}</p>
//                             <p className="text-gray-600">{item.description}</p>
//                             <p className="text-gray-600">Опции: {item.options}</p>
//                             <p className="text-gray-600">Адрес: {item.address}</p>
//
//                             {/* Кнопка для добавления в избранное */}
//                             <Button
//                                 type="primary"
//                                 onClick={() => addToFavorites(item.id)} // Передаем ID объекта
//                                 style={{ marginTop: "10px" }}
//                             >
//                                 Добавить в избранное
//                             </Button>
//                         </div>
//                     </div>
//                 </Card>
//             ))}
//         </div>
//     );
// }
//
// export default RealEstateCard;
