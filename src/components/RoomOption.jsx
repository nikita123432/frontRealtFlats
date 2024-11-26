// RoomOption.jsx
// eslint-disable-next-line no-unused-vars
import React from 'react';

// eslint-disable-next-line react/prop-types
const RoomOption = ({ label }) => {
    return (
        <div
            className="bg-gray-200 hover:bg-gray-300 rounded w-10 h-10 flex items-center justify-center cursor-pointer m-1"
        >
            {label}
        </div>
    );
};

export default RoomOption;
