import React from 'react';
import clsx from 'clsx';

interface ClimateCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    variant?: 'blue' | 'green' | 'yellow' | 'red';
    className?: string;
}

export const ClimateCard: React.FC<ClimateCardProps> = ({
    title,
    value,
    subtitle,
    variant = 'blue',
    className = ''
}) => {
    const variantStyles = {
        blue: 'bg-blue-50 text-blue-800',
        green: 'bg-green-50 text-green-800',
        yellow: 'bg-yellow-50 text-yellow-800',
        red: 'bg-red-50 text-red-800'
    };

    const valueStyles = {
        blue: 'text-blue-900',
        green: 'text-green-900',
        yellow: 'text-yellow-900',
        red: 'text-red-900'
    };

    const subtitleStyles = {
        blue: 'text-blue-700',
        green: 'text-green-700',
        yellow: 'text-yellow-700',
        red: 'text-red-700'
    };

    return (
        <div className={clsx(
            'p-4 rounded-xl shadow-sm',
            variantStyles[variant],
            className
        )}>
            <h3 className="font-semibold">{title}</h3>
            <p className={clsx('text-3xl font-bold', valueStyles[variant])}>
                {value}
            </p>
            {subtitle && (
                <p className={clsx('text-sm', subtitleStyles[variant])}>
                    {subtitle}
                </p>
            )}
        </div>
    );
};
