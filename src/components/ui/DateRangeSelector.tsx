import React from 'react';
import { validateDateRange } from '@/utils/dateUtils';

interface DateRangeSelectorProps {
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
    className?: string;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    className = ''
}) => {
    const isDateRangeValid = validateDateRange(startDate, endDate);
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD

    return (
        <div className={`mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
            <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio:
                </label>
                <input
                    type="date"
                    id="start-date"
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${!isDateRangeValid ? 'border-red-300' : 'border-gray-300'
                        }`}
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    min="1981-01-01"
                    max={today}
                />
            </div>
            <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Fin:
                </label>
                <input
                    type="date"
                    id="end-date"
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${!isDateRangeValid ? 'border-red-300' : 'border-gray-300'
                        }`}
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    min="1981-01-01"
                    max={today}
                />
            </div>
            {!isDateRangeValid && (
                <div className="col-span-full">
                    <p className="text-sm text-red-600">
                        Por favor selecciona un rango de fechas válido (entre 1981 y hoy)
                    </p>
                </div>
            )}
        </div>
    );
};
