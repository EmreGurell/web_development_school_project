"use client";

export function EmptyState({ 
    type = "default", 
    title, 
    description, 
    action = null 
}) {
    const getSVG = () => {
        switch (type) {
            case "diagnosis":
                return (
                    <svg className="w-32 h-32 mx-auto mb-4 text-blue-300" fill="none" viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="80" fill="currentColor" opacity="0.1"/>
                        <path d="M100 40 L120 90 L170 90 L130 120 L145 170 L100 140 L55 170 L70 120 L30 90 L80 90 Z" 
                              fill="currentColor" opacity="0.3" className="animate-pulse"/>
                        <circle cx="100" cy="100" r="30" fill="currentColor" opacity="0.5" className="animate-ping"/>
                    </svg>
                );
            case "measurement":
                return (
                    <svg className="w-32 h-32 mx-auto mb-4 text-green-300" fill="none" viewBox="0 0 200 200">
                        <rect x="50" y="50" width="100" height="100" rx="10" fill="currentColor" opacity="0.1" className="animate-pulse"/>
                        <line x1="70" y1="80" x2="130" y2="80" stroke="currentColor" strokeWidth="3" opacity="0.4" className="animate-pulse"/>
                        <line x1="70" y1="100" x2="130" y2="100" stroke="currentColor" strokeWidth="3" opacity="0.4" className="animate-pulse" style={{animationDelay: '0.2s'}}/>
                        <line x1="70" y1="120" x2="130" y2="120" stroke="currentColor" strokeWidth="3" opacity="0.4" className="animate-pulse" style={{animationDelay: '0.4s'}}/>
                        <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" className="animate-spin" style={{animationDuration: '3s'}}/>
                    </svg>
                );
            case "risk":
                return (
                    <svg className="w-32 h-32 mx-auto mb-4 text-red-300" fill="none" viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="70" fill="currentColor" opacity="0.1" className="animate-pulse"/>
                        <path d="M100 50 L130 90 L180 95 L145 125 L155 175 L100 150 L45 175 L55 125 L20 95 L70 90 Z" 
                              fill="currentColor" opacity="0.3" className="animate-pulse"/>
                        <circle cx="100" cy="100" r="20" fill="currentColor" opacity="0.5">
                            <animate attributeName="r" values="20;25;20" dur="2s" repeatCount="indefinite"/>
                        </circle>
                    </svg>
                );
            case "doctor":
                return (
                    <svg className="w-32 h-32 mx-auto mb-4 text-purple-300" fill="none" viewBox="0 0 200 200">
                        <circle cx="100" cy="80" r="30" fill="currentColor" opacity="0.2" className="animate-pulse"/>
                        <path d="M60 140 Q60 120 100 120 Q140 120 140 140 L140 170 L60 170 Z" 
                              fill="currentColor" opacity="0.3" className="animate-pulse"/>
                        <rect x="85" y="100" width="30" height="40" rx="5" fill="currentColor" opacity="0.2"/>
                    </svg>
                );
            default:
                return (
                    <svg className="w-32 h-32 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="60" fill="currentColor" opacity="0.1" className="animate-pulse"/>
                        <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                    </svg>
                );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            {getSVG()}
            {title && (
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {title}
                </h3>
            )}
            {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xs">
                    {description}
                </p>
            )}
            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </div>
    );
}

