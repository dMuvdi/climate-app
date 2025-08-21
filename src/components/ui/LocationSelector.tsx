import React from 'react';
import { LOCATION_COORDINATES } from '@/constants/locations';

interface LocationSelectorProps {
    selectedLocation: string;
    onLocationChange: (location: string) => void;
    className?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
    selectedLocation,
    onLocationChange,
    className = ''
}) => {
    return (
        <div className={`bg-white p-4 rounded-xl shadow-md ${className}`}>
            <label htmlFor="location-selector" className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona tu Región:
            </label>
            <select
                id="location-selector"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedLocation}
                onChange={(e) => onLocationChange(e.target.value)}
            >
                {LOCATION_COORDINATES.map((location) => (
                    <option key={location.region} value={location.region}>
                        {location.name}
                    </option>
                ))}
            </select>
        </div>
    );
};
