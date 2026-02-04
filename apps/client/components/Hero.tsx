
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './UI';
import { ArrowDown } from 'lucide-react';

interface HeroProps {
  onCtaClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-bg overflow-hidden pt-32 pb-12 px-6">
      
      {/* Soft Blobs Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-lavender rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-powder rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-blush rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center">
        
        {/* Main Logo Replacement */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative mb-10"
        >
          <h1 className="font-display italic font-semibold text-[130px] md:text-[180px] leading-none text-mocha tracking-tighter relative z-10 mix-blend-multiply">
            Florett
          </h1>
          
          {/* Decorative Elements for Logo */}
          <div className="absolute -top-4 -right-8 md:-right-12 w-24 h-24 md:w-32 md:h-32 text-sage opacity-80 pointer-events-none animate-float">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M50 95C50 95 30 75 30 50C30 25 50 5 50 5C50 5 70 25 70 50C70 75 50 95 50 95Z" fill="#D1E2D5" fillOpacity="0.5"/>
              <path d="M50 95C50 95 50 60 50 50C50 40 50 5 50 5" stroke="#A5C2AC" strokeWidth="2" strokeLinecap="round"/>
              <path d="M50 50C50 50 30 40 20 30" stroke="#A5C2AC" strokeWidth="2" strokeLinecap="round"/>
              <path d="M50 60C50 60 70 50 80 40" stroke="#A5C2AC" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="absolute top-1/2 -left-12 w-16 h-16 bg-blush/40 rounded-full blur-xl -z-10"></div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="font-body text-xl md:text-2xl text-text-muted max-w-2xl mb-12 leading-relaxed"
        >
          Забудьте о спешке. Мы создаем букеты как форму заботы о себе и близких. 
          Мягкие оттенки, естественные формы и спокойствие в каждом лепестке.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          <Button onClick={onCtaClick} variant="primary" className="text-lg px-10">
            Выбрать букет
          </Button>
          <Button onClick={() => window.open('https://youtu.be/dQw4w9WgXcQ?si=mJjvHxLyKq4GTvy9', '_blank')} variant="ghost" className="text-lg">
            Написать нам
          </Button>
        </motion.div>
      </div>

      {/* Hero Images - Floating Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8, type: "spring", bounce: 0.2 }}
        className="relative w-full max-w-6xl mt-20 h-[300px] md:h-[400px] hidden md:block"
      >
        <div className="absolute left-[10%] bottom-0 w-[280px] h-[350px] bg-white p-3 rounded-3xl shadow-float rotate-[-6deg] hover:rotate-[-2deg] transition-transform duration-500 hover:z-10 cursor-pointer">
          <img 
             src="https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=600&auto=format&fit=crop" 
             className="w-full h-full object-cover rounded-2xl" 
             alt="Calm bouquet"
          />
        </div>
        <div className="absolute left-[50%] -translate-x-1/2 bottom-10 w-[320px] h-[400px] bg-white p-3 rounded-3xl shadow-float z-10 hover:scale-105 transition-transform duration-500 cursor-pointer">
           <img 
             src="https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=600&auto=format&fit=crop" 
             className="w-full h-full object-cover rounded-2xl" 
             alt="Soft bouquet"
          />
        </div>
        <div className="absolute right-[10%] bottom-0 w-[280px] h-[350px] bg-white p-3 rounded-3xl shadow-float rotate-[6deg] hover:rotate-[2deg] transition-transform duration-500 hover:z-10 cursor-pointer">
           <img 
             src="https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=600&auto=format&fit=crop" 
             className="w-full h-full object-cover rounded-2xl" 
             alt="Warm bouquet"
          />
        </div>
      </motion.div>
      
      {/* Mobile Image */}
      <motion.div 
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ delay: 0.8 }}
         className="mt-12 md:hidden w-full max-w-sm aspect-[4/5] bg-white p-3 rounded-3xl shadow-float rotate-2"
      >
        <img 
           src="https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=600&auto=format&fit=crop" 
           className="w-full h-full object-cover rounded-2xl" 
           alt="Soft bouquet"
        />
      </motion.div>

    </section>
  );
};
