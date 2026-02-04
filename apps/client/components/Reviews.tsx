
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Review } from '../types';
import { Star, Quote, MessageCircle } from 'lucide-react';
import { Button } from './UI';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reviews?approved=true')
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reviews:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="bg-bg min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-blush/30 text-mocha font-heading font-bold text-sm rounded-pill mb-4 uppercase tracking-wider">
              Теплые слова
            </span>
            <h2 className="font-display italic font-bold text-6xl md:text-7xl text-mocha mb-6">
              Ваши истории
            </h2>
            <p className="text-text-muted font-body text-xl max-w-2xl mx-auto leading-relaxed">
              Мы счастливы быть частью ваших важных моментов. Спасибо, что доверяете нам свои чувства.
            </p>
          </motion.div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-mocha/20 border-t-mocha rounded-full animate-spin"></div>
          </div>
        ) : (
          /* Masonry Grid Layout using CSS Columns */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
          >
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                variants={itemVariants}
                className={`break-inside-avoid relative p-8 rounded-[32px] transition-all duration-300 hover:shadow-float group ${
                  review.highlight
                    ? 'bg-gradient-to-br from-white to-blush/20 border-2 border-white'
                    : 'bg-white shadow-soft'
                }`}
              >
                <Quote
                  size={40}
                  className={`absolute top-6 right-6 opacity-20 rotate-12 transition-transform duration-500 group-hover:rotate-0 ${
                    review.highlight ? 'text-mocha' : 'text-sage-dark'
                  }`}
                />

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${i < review.rating ? 'fill-mocha text-mocha' : 'text-gray-300'} transition-all duration-300 group-hover:scale-110`}
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>

                <p className="text-text-main font-body text-lg leading-relaxed mb-6 relative z-10">
                  {review.text}
                </p>

                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <div>
                    <h4 className="font-heading font-bold text-lg text-text-main">{review.author}</h4>
                    <span className="text-xs text-text-muted font-medium uppercase tracking-wide">{review.date}</span>
                  </div>
                  {review.highlight && (
                     <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <HeartIcon />
                     </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-white rounded-[40px] p-10 md:p-14 shadow-float inline-block max-w-4xl w-full relative overflow-hidden">
             {/* Decorative circles */}
             <div className="absolute top-0 left-0 w-32 h-32 bg-sage/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-mocha/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

             <h3 className="font-heading font-bold text-3xl text-text-main mb-4">
               Поделитесь своими впечатлениями
             </h3>
             <p className="text-text-muted font-body text-lg mb-8 max-w-xl mx-auto">
               Нам очень важно знать, что вы думаете. Напишите нам в Telegram, и мы с радостью опубликуем ваш отзыв.
             </p>
             <Button
                onClick={() => window.open('https://t.me/florett_flowers', '_blank')}
                className="gap-2 pl-6 pr-8 shadow-xl shadow-mocha/10"
             >
                <MessageCircle size={20} />
                Написать отзыв
             </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Tiny helper for the heart icon
const HeartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#E8C6C1"/>
  </svg>
);
