import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center mb-8 px-4 md:px-6 mt-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Vigía Verde 🍃
            </h1>
            <p className="mt-2 text-lg text-gray-600">
                Conectando el clima, la biodiversidad y la acción en Colombia.
            </p>
        </header>
    );
};
