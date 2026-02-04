import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bouquet, Category } from '../types';
import { categories } from '../data';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

// --- Filter Tabs ---
interface FilterTabsProps {
  selectedCategory: Category;
  onSelect: (category: Category) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ selectedCategory, onSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-4xl mx-auto">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.value as Category)}
          className={`relative px-6 py-3 rounded-pill text-base font-heading font-bold transition-all duration-300 transform hover:-translate-y-1 ${
            selectedCategory === cat.value 
              ? 'bg-mocha text-white shadow-lg shadow-mocha/20' 
              : 'bg-white text-text-muted hover:bg-gray-50 border border-transparent hover:border-gray-100'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

// --- Product Card ---
interface ProductCardProps {
  bouquet: Bouquet;
  onClick: (bouquet: Bouquet) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ bouquet, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(bouquet.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(bouquet.id);
  };

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    // Start slideshow if hovered and has multiple images
    if (isHovered && bouquet.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % bouquet.images.length);
      }, 1500); // Switch every 1.5 seconds
    }
    // We intentionally removed the reset to 0 here to prevent visual "jerking" when hovering out.
    // The image will simply pause on the current frame.

    return () => clearInterval(interval);
  }, [isHovered, bouquet.images.length]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, scale: 1.02 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group cursor-pointer bg-white p-4 rounded-[32px] hover:shadow-float transition-shadow duration-500"
      onClick={() => onClick(bouquet)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-[24px] aspect-[4/5] mb-5 bg-gray-50 isolate">
        <div className="absolute inset-0 bg-gray-100 animate-pulse -z-10" /> {/* Placeholder */}
        
        {/* Image Slideshow */}
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentImageIndex}
            src={bouquet.images[currentImageIndex]}
            alt={bouquet.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`absolute top-3 right-3 backdrop-blur-sm p-2.5 rounded-full transform transition-all duration-300 z-10 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          } ${inCart ? 'bg-sage text-white' : 'bg-white/90 text-mocha hover:bg-mocha hover:text-white'}`}
          aria-label={inCart ? 'В корзине' : 'Добавить в корзину'}
        >
          {inCart ? <Check size={20} /> : <ShoppingBag size={20} />}
        </button>

        {/* Progress Dots (Visible on hover if > 1 image) */}
        {bouquet.images.length > 1 && (
          <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 transition-opacity duration-300 z-10 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            {bouquet.images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full shadow-sm backdrop-blur-sm transition-all duration-300 ${
                  idx === currentImageIndex 
                    ? 'w-4 bg-white' 
                    : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="px-2 pb-2 relative z-10">
        <h3 className="font-heading font-bold text-xl text-text-main mb-1 group-hover:text-mocha transition-colors">
          {bouquet.name}
        </h3>
        <div className="flex justify-between items-end">
          <p className="text-text-muted text-sm font-body font-medium">
            {categories.find(c => c.value === bouquet.category)?.label}
          </p>
          <span className="font-heading font-extrabold text-lg text-mocha bg-mocha/10 px-3 py-1 rounded-pill">
            {bouquet.price.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// --- Catalog Grid ---
interface CatalogProps {
  bouquets: Bouquet[];
  selectedCategory: Category;
  onCategoryChange: (cat: Category) => void;
  onBouquetClick: (b: Bouquet) => void;
  isLoading?: boolean;
}

export const Catalog: React.FC<CatalogProps> = ({ bouquets, selectedCategory, onCategoryChange, onBouquetClick, isLoading }) => {
  const filteredBouquets = selectedCategory === 'all'
    ? bouquets
    : bouquets.filter(b => b.category === selectedCategory);

  return (
    <section id="catalog" className="py-24 px-6 md:px-12 bg-bg rounded-t-[48px] -mt-12 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-text-main mb-6">Коллекция</h2>
          <p className="text-text-muted font-body text-xl max-w-2xl mx-auto leading-relaxed">
            Мы не гонимся за трендами. Мы собираем букеты, которые приносят покой и уют.
          </p>
        </div>

        <FilterTabs selectedCategory={selectedCategory} onSelect={onCategoryChange} />

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          <AnimatePresence mode='popLayout'>
            {filteredBouquets.map((bouquet) => (
              <ProductCard key={bouquet.id} bouquet={bouquet} onClick={onBouquetClick} />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredBouquets.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-lavender/30 rounded-full mb-4">
              <span className="text-4xl">🍃</span>
            </div>
            <p className="text-text-muted font-body text-lg">В этой категории пока тихо.</p>
          </div>
        )}
      </div>
    </section>
  );
};