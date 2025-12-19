export default function HealthCard({
                                       title,
                                       description,
                                       icon,
                                       iconColor = "text-blue-600 dark:text-blue-400",
                                       iconBg = "bg-blue-100 dark:bg-blue-900/50",
                                   }) {
    return (
        <div className="group bg-gray-50 dark:bg-gray-800 rounded-2xl p-6
                        hover:shadow-xl transition-all duration-300
                        border border-transparent hover:border-blue-100 dark:hover:border-blue-900
                        relative overflow-hidden">

            {/* ÜST GRADIENT BAR */}
            <div
                className="absolute top-0 left-0 w-full h-1.5
                           bg-gradient-to-r from-blue-400 to-blue-600
                           transform origin-left scale-x-0
                           group-hover:scale-x-100
                           transition-transform duration-300"
            />

            {/* ICON */}
            <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6
                            group-hover:scale-110 transition-transform duration-300
                            ${iconBg} ${iconColor}`}
            >
                {icon}
            </div>

            {/* TITLE */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>

            {/* DESCRIPTION */}
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {description}
            </p>
        </div>
    );
}
