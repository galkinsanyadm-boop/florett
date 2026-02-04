
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sun, ChevronLeft, ChevronRight, ShoppingBag, Check } from 'lucide-react';
import { Bouquet } from '../types';
import { Button } from './UI';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  bouquet: Bouquet | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ bouquet, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { addItem, isInCart } = useCart();

  if (!bouquet) return null;

  const inCart = isInCart(bouquet.id);

  const handleAddToCart = () => {
    addItem(bouquet.id);
  };

  const handleOrder = () => {
    // const text = `Привет! Мне очень понравился букет "${bouquet.name}" за ${bouquet.price}₽. Хочу заказать! ✨`;
    // const url = `https://t.me/florett_shop?text=${encodeURIComponent(text)}`;
    const url = 'https://youtu.be/dQw4w9WgXcQ?si=mJjvHxLyKq4GTvy9';
    window.open(url, '_blank');
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setActiveImageIndex((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = bouquet.images.length - 1;
      if (next >= bouquet.images.length) next = 0;
      return next;
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : direction < 0 ? '-100%' : 0,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : direction > 0 ? '-100%' : 0,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <AnimatePresence>
      {bouquet && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-mocha/20 backdrop-blur-md z-50 cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-[10%] md:left-[10%] md:right-[10%] md:bottom-[10%] bg-white md:rounded-[40px] rounded-[32px] shadow-float z-50 overflow-hidden flex flex-col md:flex-row pointer-events-auto"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-50 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-bg transition-colors text-text-main shadow-sm"
            >
              <X size={24} />
            </button>

            {/* Gallery Section */}
            <div className="w-full md:w-1/2 h-[45vh] md:h-full relative bg-gray-50 p-4 md:p-6 group">
              <div className="w-full h-full rounded-[32px] overflow-hidden relative shadow-inner bg-white isolate">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    key={activeImageIndex}
                    src={bouquet.images[activeImageIndex]}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x);
                      if (swipe < -swipeConfidenceThreshold) {
                        paginate(1);
                      } else if (swipe > swipeConfidenceThreshold) {
                        paginate(-1);
                      }
                    }}
                    alt={bouquet.name}
                    className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
                  />
                </AnimatePresence>
                
                {/* Navigation Arrows */}
                {bouquet.images.length > 1 && (
                    <>
                        <button 
                            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/60 backdrop-blur-md rounded-full text-text-main hover:bg-white transition-all md:opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
                            aria-label="Предыдущее фото"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); paginate(1); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/60 backdrop-blur-md rounded-full text-text-main hover:bg-white transition-all md:opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
                            aria-label="Следующее фото"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
              </div>
              
              {/* Thumbnails */}
              {bouquet.images.length > 1 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-pill shadow-sm z-20">
                  {bouquet.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setDirection(idx > activeImageIndex ? 1 : -1);
                        setActiveImageIndex(idx); 
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        idx === activeImageIndex ? 'bg-mocha w-8' : 'bg-mocha/30 hover:bg-mocha/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 h-full overflow-y-auto p-8 md:p-12 flex flex-col bg-white">
              <div className="flex-1">
                <motion.div 
                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                   className="flex items-center gap-2 mb-4"
                >
                  <span className="px-3 py-1 bg-sage/20 text-sage-dark font-heading font-bold text-xs uppercase tracking-wider rounded-pill">
                    Авторский сбор
                  </span>
                </motion.div>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="font-heading font-extrabold text-4xl md:text-5xl text-text-main mb-2"
                >
                  {bouquet.name}
                </motion.h2>

                <motion.p 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="text-3xl font-heading font-bold text-mocha mb-8"
                >
                  {bouquet.price.toLocaleString('ru-RU')} ₽
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  className="space-y-8 text-text-muted font-body mb-8"
                >
                  <p className="leading-loose text-lg">
                    {bouquet.description}
                  </p>
                  
                  <div className="bg-bg p-8 rounded-[32px]">
                    <h4 className="font-heading font-bold text-text-main text-lg mb-4 flex items-center gap-2">
                      <Sun size={20} className="text-butter-dark" />
                      Что внутри
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {bouquet.composition.map((item, i) => (
                        <span key={i} className="px-4 py-2 bg-white rounded-pill text-sm shadow-sm text-text-main border border-gray-100">
                          {item}
                        </span>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                      <span>Примерный размер</span>
                      <span className="font-bold text-text-main bg-white px-3 py-1 rounded-lg">{bouquet.size}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="mt-6 space-y-3"
              >
                 <div className="flex gap-3">
                   <Button onClick={handleOrder} className="flex-1 text-lg gap-3 shadow-xl shadow-mocha/20">
                     <span>Хочу этот букет</span>
                     <ArrowRight size={20} />
                   </Button>
                   <button
                     onClick={handleAddToCart}
                     className={`px-5 py-4 rounded-pill font-heading font-bold transition-all duration-300 flex items-center gap-2 ${
                       inCart
                         ? 'bg-sage text-white'
                         : 'bg-bg text-mocha hover:bg-mocha/10 border border-mocha/20'
                     }`}
                   >
                     {inCart ? <Check size={20} /> : <ShoppingBag size={20} />}
                     <span className="hidden sm:inline">{inCart ? 'В корзине' : 'В корзину'}</span>
                   </button>
                 </div>
                 <p className="text-sm text-text-muted/60 text-center font-medium">
                   Менеджер уточнит детали доставки в Telegram
                 </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
