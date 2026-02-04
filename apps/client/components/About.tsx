import React from 'react';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
  return (
    <section className="bg-bg min-h-screen pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Intro */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center mb-32 relative">
          
          {/* Background decoration */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-butter/30 rounded-full blur-[100px] -z-10" />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 relative"
          >
            <div className="aspect-[4/5] rounded-[48px] overflow-hidden shadow-float rotate-[-2deg]">
              <img 
                src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1600&auto=format&fit=crop" 
                alt="Florist" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2"
          >
            <span className="inline-block px-4 py-2 bg-lavender/40 text-text-main font-heading font-bold text-sm rounded-pill mb-6">
              Наша философия
            </span>
            <h2 className="font-heading font-extrabold text-5xl text-text-main mb-8 leading-tight">
              Мы создаем <br /> <span className="text-mocha">пространство покоя</span>
            </h2>
            <div className="space-y-6 text-xl text-text-muted font-body leading-loose">
              <p>
                В мире, полном шума, мы выбрали тишину. Florett — это не конвейер по сборке букетов. Это место, где время замедляется.
              </p>
              <p>
                Мы верим, что цветы — это самый простой способ вернуть себе ощущение дома и безопасности. Это "заземление" через красоту.
              </p>
              <p>
                Каждый стебель мы подбираем так, чтобы он не просто стоял в вазе, а рассказывал историю о нежности и заботе. Без лишнего пафоса. Просто и честно.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Gallery Grid - Bubbles */}
        <div className="flex flex-wrap justify-center gap-8 mb-32">
          <motion.div 
             initial={{ opacity: 0, scale: 0 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1, type: "spring" }}
             className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-soft"
          >
            <img src="https://images.unsplash.com/photo-1457089328109-e5d9bd499191?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="Detail" />
          </motion.div>
          <motion.div 
             initial={{ opacity: 0, scale: 0 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2, type: "spring" }}
             className="w-80 h-80 rounded-full overflow-hidden border-4 border-white shadow-soft md:-mt-12"
          >
            <img src="https://i.ibb.co/gn43jVL/unnamed.png" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="Detail" />
          </motion.div>
          <motion.div 
             initial={{ opacity: 0, scale: 0 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.3, type: "spring" }}
             className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-soft"
          >
             <img src="https://i.ibb.co/TDNJTSv0/images.jpg" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="Detail" />
          </motion.div>
        </div>

        {/* Info Block */}
        <div className="bg-white rounded-[48px] p-10 md:p-20 text-center shadow-float relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-powder/30 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sage/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>
          
          <h3 className="font-heading font-extrabold text-3xl md:text-4xl text-text-main mb-6 relative z-10">
            Заходите подышать)
          </h3>
          <p className="text-text-muted font-body text-xl max-w-2xl mx-auto mb-10 relative z-10">
            У нас всегда пахнет эвкалиптом и свежим кофе. Мы будем рады просто поговорить или помолчать вместе с вами.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 relative z-10">
            <div className="bg-bg px-8 py-6 rounded-3xl">
               <span className="block text-sm font-bold text-mocha mb-1 uppercase tracking-wide">Адрес</span>
               <span className="text-xl font-heading font-bold text-text-main">пр. Красноармейский, 133</span>
            </div>
            <div className="bg-bg px-8 py-6 rounded-3xl">
               <span className="block text-sm font-bold text-mocha mb-1 uppercase tracking-wide">Время</span>
               <span className="text-xl font-heading font-bold text-text-main">09:00 – 21:00</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};