import { useParams } from 'react-router-dom';

const ChatPage = () => {
    const { userId } = useParams();

    return (
        <div>
            <h1>Чат с пользователем {userId}</h1>
            {/* Здесь добавьте логику чата, например, отображение сообщений */}
        </div>
    );
};

export default ChatPage;
