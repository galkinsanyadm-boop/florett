
import React from 'react';
import { ViewState } from '../types';
import { Instagram, Send, Phone, MapPin, Clock, Heart, Flower2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

// --- Header ---
interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onCartOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onCartOpen }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    onNavigate('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navButtonClass = (view: ViewState) => `
    px-5 py-2.5 rounded-full text-base font-heading font-bold transition-all duration-300 whitespace-nowrap flex-shrink-0
    ${currentView === view 
      ? 'bg-mocha text-white shadow-lg shadow-mocha/20' 
      : 'text-text-muted hover:text-text-main hover:bg-white/60'}
  `;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 pointer-events-none ${scrolled ? 'pt-2' : 'pt-6'}`}>
      <nav 
        className={`
          pointer-events-auto
          flex items-center gap-1 p-2 rounded-full transition-all duration-500
          bg-white/80 backdrop-blur-2xl border border-white/50 shadow-soft
          max-w-[95vw] overflow-x-auto [&::-webkit-scrollbar]:hidden
          ${scrolled ? 'scale-[0.95] shadow-md' : 'scale-100'}
        `}
      >
        <button 
          onClick={handleLogoClick}
          className="flex-shrink-0 flex items-center gap-3 pl-5 pr-4 py-1.5 rounded-full hover:bg-white/50 transition-colors duration-300 group"
        >
          <Flower2 className="text-mocha transition-transform duration-500 group-hover:rotate-45" size={26} />
          <span className="font-display italic font-bold text-3xl text-mocha tracking-wide leading-none pt-1.5">Florett</span>
        </button>

        <div className="flex-shrink-0 w-px h-8 bg-mocha/20 mx-1 rounded-full"></div>

        <div className="flex items-center gap-0.5">
          <button 
            onClick={() => onNavigate('catalog')}
            className={navButtonClass('catalog')}
          >
            Букеты
          </button>
          <button 
            onClick={() => onNavigate('reviews')}
            className={navButtonClass('reviews')}
          >
            Отзывы
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={navButtonClass('about')}
          >
            О нас
          </button>
        </div>

        <div className="flex-shrink-0 w-px h-8 bg-mocha/20 mx-1 rounded-full"></div>

        <button
          onClick={onCartOpen}
          className="relative flex-shrink-0 p-3 rounded-full text-mocha hover:bg-white/60 transition-all duration-300"
          aria-label="Корзина"
        >
          <ShoppingBag size={22} />
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blush text-text-main text-xs font-heading font-bold rounded-full flex items-center justify-center shadow-sm"
              >
                {totalItems > 9 ? '9+' : totalItems}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>
    </div>
  );
};

// --- Footer ---
export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 mx-4 md:mx-8 mb-6 bg-white rounded-4xl p-8 md:p-12 shadow-soft">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="flex flex-col gap-4 max-w-xs">
          <span className="font-display italic font-bold text-4xl text-mocha">Florett</span>
          <p className="text-text-muted text-lg font-body leading-relaxed">
            Создаем моменты тихой радости. Цветы, которые поднимают настроение.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-heading font-bold text-text-main text-lg">Мы тут</h4>
          <div className="flex items-center gap-3 text-text-muted font-body text-base bg-bg p-3 rounded-2xl">
            <MapPin size={20} className="text-sage-dark" />
            <span>пр. Красноармейский, 133</span>
          </div>
          <div className="flex items-center gap-3 text-text-muted font-body text-base bg-bg p-3 rounded-2xl">
            <Clock size={20} className="text-powder-dark" />
            <span>09:00 – 21:00</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-heading font-bold text-text-main text-lg">Давайте дружить</h4>
          <div className="flex gap-4">
            <SocialIcon 
              icon={<Send size={30} className="-ml-1 mt-1" />} 
              href="https://youtu.be/dQw4w9WgXcQ?si=mJjvHxLyKq4GTvy9" 
              label="Telegram" 
              color="bg-powder hover:bg-powder-dark" 
            />
            <SocialIcon 
              icon={<Instagram size={30} />} 
              href="https://youtu.be/dQw4w9WgXcQ?si=mJjvHxLyKq4GTvy9" 
              label="Instagram" 
              color="bg-blush hover:bg-blush-dark" 
            />
          </div>
        </div>
      </div>
      
      <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm font-body font-medium text-text-muted/60 gap-4">
        <span>© 2026 Florett</span>
        <span className="flex items-center gap-1">Made with <Heart size={14} className="fill-blush text-blush" /> & love</span>
      </div>
    </footer>
  );
};

const SocialIcon: React.FC<{ icon: React.ReactNode, href: string, label: string, color: string }> = ({ icon, href, label, color }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    aria-label={label}
    className={`w-20 h-20 rounded-3xl flex items-center justify-center text-text-main transition-all duration-300 hover:scale-110 hover:-rotate-3 ${color}`}
  >
    {icon}
  </a>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center px-8 py-4 rounded-pill transition-all duration-300 font-heading font-bold text-base tracking-wide transform active:scale-95";
  const variants = {
    primary: "bg-mocha text-white hover:bg-mocha-light shadow-lg shadow-mocha/20 hover:shadow-xl hover:shadow-mocha/30 hover:-translate-y-0.5",
    secondary: "bg-sage text-text-main hover:bg-sage-dark shadow-md shadow-sage/20",
    ghost: "bg-transparent text-mocha hover:bg-bg border-2 border-transparent hover:border-mocha/10"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
