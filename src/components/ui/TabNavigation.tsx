import React from 'react';
import clsx from 'clsx';

interface Tab {
    id: string;
    label: string;
}

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    className?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
    tabs,
    activeTab,
    onTabChange,
    className = ''
}) => {
    return (
        <div className={`bg-white p-4 rounded-xl shadow-md ${className}`}>
            <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="flex -mb-px space-x-6" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={clsx(
                                'tab-button whitespace-nowrap py-4 px-4 border-b-2 font-semibold text-base transition-colors duration-200',
                                activeTab === tab.id
                                    ? 'tab-active border-green-500 text-gray-900'
                                    : 'tab-inactive border-transparent text-gray-600'
                            )}
                            onClick={() => onTabChange(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};
