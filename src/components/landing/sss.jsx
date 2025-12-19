import React from 'react';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

function Sss() {
    return (
        <section className="py-20 bg-white dark:bg-surface-dark transition-colors duration-300 ">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center gap-2 text-center mb-16">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Sıkça Sorulan Sorular
                </h1>
                <h2 className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                    Platform hakkında en çok merak edilen soruların cevapları
                </h2>
            </div>

            <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
            >
                <AccordionItem value="item-1">
                    <AccordionTrigger>Bu platform ne işe yarar?</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        Bu platform, sağlık ölçümlerinizi (ör. kan şekeri, nabız vb.) düzenli olarak takip etmenizi, risk analizleri almanızı ve doktorunuzla daha sağlıklı bir iletişim kurmanızı sağlar.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Risk skoru nasıl hesaplanıyor?</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        Risk skoru; son ölçümleriniz, geçmiş teşhisleriniz ve belirli tıbbi kurallar kullanılarak hesaplanır. Ayrıca yapay zekâ destekli analizler ile risk seviyesi daha doğru şekilde yorumlanır.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Yapay zekâ doktorun yerini mi alıyor?</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        Hayır. Yapay zekâ yalnızca destekleyici bir analiz aracıdır. Nihai kararlar her zaman doktorunuz tarafından verilmelidir.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>Ölçümlerimi ne sıklıkla girmeliyim?</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        Bu, sağlık durumunuza göre değişir. Genel olarak günde 1–2 ölçüm önerilir. Doktorunuz özel bir sıklık belirleyebilir.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger>Risk skorum yükselirse ne yapmalıyım?</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        Risk skoru yükseldiğinde platform size öneriler sunar. Ancak mutlaka doktorunuza danışmanız tavsiye edilir.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger>Yapay zekâ önerileri neye göre oluşturuluyor?</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        Öneriler; ölçüm trendleri, risk skorları ve tıbbi kurallara göre otomatik olarak oluşturulur. Bu öneriler bilgilendirme amaçlıdır.
                    </AccordionContent>
                </AccordionItem>
              
            </Accordion></div>
        </section>
    );
}

export default Sss;