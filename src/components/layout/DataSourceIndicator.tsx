import React from 'react';
import clsx from 'clsx';

interface DataSourceIndicatorProps {
    isStaticData: boolean;
    isLoading: boolean;
    error: Error | null;
    className?: string;
}

export const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({
    isStaticData,
    isLoading,
    error,
    className = ''
}) => {
    if (isLoading) {
        return (
            <div className={clsx('text-sm text-gray-500 mt-3', className)}>
                <span className="font-semibold">Estado:</span> Cargando datos de la NASA...
            </div>
        );
    }

    if (error) {
        return (
            <div className={clsx('text-sm text-orange-600 mt-3', className)}>
                <span className="font-semibold">Nota:</span> Usando datos estáticos debido a un error en la conexión con la NASA POWER API.
            </div>
        );
    }

    if (isStaticData) {
        return (
            <div className={clsx('text-sm text-gray-500 mt-3', className)}>
                <span className="font-semibold">Nota:</span> En este MVP, los datos mostrados son estáticos. Los selectores de fecha están listos para integrar datos dinámicos en futuras versiones.
            </div>
        );
    }

    return (
        <div className={clsx('text-sm text-green-600 mt-3', className)}>
            <span className="font-semibold">✓</span> Datos en tiempo real de la NASA POWER API
        </div>
    );
};
