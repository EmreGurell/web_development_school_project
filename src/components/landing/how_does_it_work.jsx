import React from "react";

function HowDoesItWork() {
    return (
        <section
            className="
       py-20 transition-colors duration-300 text-center
      "
        >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-16">
                Nasıl Kullanılır?
            </h1>

            {/* Video Wrapper */}
            <div className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-lg m-auto">
                <iframe
                    src="https://www.youtube.com/embed/MrqP8Gp3ACA"
                    className="w-full h-full"
                    title="Nasıl Kullanılır Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </section>
    );
}

export default HowDoesItWork;
