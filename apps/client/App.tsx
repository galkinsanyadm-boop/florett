
import React, { useState, useEffect } from 'react';
import { ViewState, Bouquet, Category } from './types';
import { bouquets } from './data';
import { Header, Footer } from './components/UI';
import { Hero } from './components/Hero';
import { Catalog } from './components/Catalog';
import { Reviews } from './components/Reviews';
import { ProductModal } from './components/ProductModal';
import { About } from './components/About';
import { CartPanel } from './components/CartPanel';
import { CartProvider } from './context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedBouquet, setSelectedBouquet] = useState<Bouquet | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
  };

  const handleHeroCta = () => {
    const catalogElement = document.getElementById('catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <CartProvider bouquets={bouquets}>
    <div className="min-h-screen bg-cream text-charcoal selection:bg-sage/30">
      <Header currentView={currentView} onNavigate={handleNavigate} onCartOpen={() => setIsCartOpen(true)} />

      <main className="min-h-screen">
        <AnimatePresence mode='wait'>
          {currentView === 'catalog' && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Hero onCtaClick={handleHeroCta} />
              <Catalog
                bouquets={bouquets}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onBouquetClick={setSelectedBouquet}
              />
            </motion.div>
          )}

          {currentView === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Reviews />
            </motion.div>
          )}

          {currentView === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <About />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      <ProductModal
        bouquet={selectedBouquet}
        onClose={() => setSelectedBouquet(null)}
      />

      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
    </CartProvider>
  );
};

export default App;
