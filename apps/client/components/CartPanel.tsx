import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, Send, Check, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from './UI';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderForm {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  comment: string;
}

export const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart, getBouquetById } = useCart();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<OrderForm>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    deliveryDate: '',
    deliveryTime: '',
    comment: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async () => {
    if (!form.customerName || !form.customerPhone || !form.deliveryAddress || !form.deliveryDate || !form.deliveryTime) {
      setError('Заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map(item => ({
            bouquetId: item.bouquetId,
            quantity: item.quantity
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка при оформлении заказа');
      }

      setOrderSuccess(true);
      clearCart();
      setForm({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        deliveryAddress: '',
        deliveryDate: '',
        deliveryTime: '',
        comment: ''
      });
    } catch (err) {
      setError('Не удалось оформить заказ. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setOrderSuccess(false);
    setError('');
    onClose();
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-mocha/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-float z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {showForm && !orderSuccess && (
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 hover:bg-bg rounded-full transition-colors mr-1"
                  >
                    <ArrowLeft size={20} className="text-text-muted" />
                  </button>
                )}
                <ShoppingBag size={24} className="text-mocha" />
                <h2 className="font-heading font-bold text-xl text-text-main">
                  {orderSuccess ? 'Заказ оформлен' : showForm ? 'Оформление' : 'Корзина'}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-bg rounded-full transition-colors"
              >
                <X size={24} className="text-text-muted" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {orderSuccess ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check size={40} className="text-green-600" />
                  </div>
                  <p className="text-text-main font-heading text-xl font-bold mb-2">Спасибо за заказ!</p>
                  <p className="text-text-muted font-body">Мы свяжемся с вами для подтверждения</p>
                </div>
              ) : showForm ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-body text-text-muted mb-1">Ваше имя *</label>
                    <input
                      type="text"
                      name="customerName"
                      value={form.customerName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-bg rounded-xl border-0 font-body focus:ring-2 focus:ring-mocha/20 outline-none"
                      placeholder="Как к вам обращаться"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body text-text-muted mb-1">Телефон *</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={form.customerPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-bg rounded-xl border-0 font-body focus:ring-2 focus:ring-mocha/20 outline-none"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body text-text-muted mb-1">Email</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={form.customerEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-bg rounded-xl border-0 font-body focus:ring-2 focus:ring-mocha/20 outline-none"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body text-text-muted mb-1">Адрес доставки *</label>
                    <input
                      type="text"
                      name="deliveryAddress"
                      value={form.deliveryAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-bg rounded-xl border-0 font-body focus:ring-2 focus:ring-mocha/20 outline-none"
                      placeholder="Улица, дом, квартира"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body text-text-muted mb-1">Дата *</label>
                      <input
                        type="date"
                        name="deliveryDate"
                        value={form.deliveryDate}
                        onChange={handleInputChange}
                        min={minDate}
                        className="w-full px-4 py-3 bg-bg rounded-xl border-0 font-body focus:ring-2 focus:ring-mocha/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-body text-text-muted mb-1">Время *</label>
                      <input
                        type="time"
                        name="deliveryTime"
                        value={form.deliveryTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-bg rounded-xl border-0 font-body focus:ring-2 focus:ring-mocha/20 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-body text-text-muted mb-1">Комментарий</label>
                    <textarea
                      name="comment"
                      value={form.comment}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-bg rounded-xl border-0 font-body focus:ring-2 focus:ring-mocha/20 outline-none resize-none"
                      placeholder="Пожелания к заказу"
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm font-body">{error}</p>
                  )}
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-bg rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={32} className="text-text-muted" />
                  </div>
                  <p className="text-text-muted font-body text-lg mb-2">Корзина пуста</p>
                  <p className="text-text-muted/60 font-body text-sm">Добавьте букеты из каталога</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => {
                    const bouquet = getBouquetById(item.bouquetId);
                    if (!bouquet) return null;

                    return (
                      <motion.div
                        key={item.bouquetId}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex gap-4 bg-bg p-4 rounded-2xl"
                      >
                        <img
                          src={bouquet.images[0]}
                          alt={bouquet.name}
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading font-bold text-text-main truncate">
                            {bouquet.name}
                          </h3>
                          <p className="text-mocha font-heading font-bold">
                            {bouquet.price.toLocaleString('ru-RU')} ₽
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.bouquetId, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-gray-50 transition-colors"
                            >
                              <Minus size={16} className="text-text-muted" />
                            </button>
                            <span className="w-8 text-center font-heading font-bold text-text-main">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.bouquetId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-gray-50 transition-colors"
                            >
                              <Plus size={16} className="text-text-muted" />
                            </button>
                            <button
                              onClick={() => removeItem(item.bouquetId)}
                              className="ml-auto w-8 h-8 flex items-center justify-center hover:bg-blush/20 rounded-full transition-colors"
                            >
                              <Trash2 size={16} className="text-blush-dark" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {!orderSuccess && items.length > 0 && (
              <div className="p-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted font-body">Итого:</span>
                  <span className="text-2xl font-heading font-extrabold text-mocha">
                    {getTotalPrice().toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                {showForm ? (
                  <Button onClick={handleSubmitOrder} disabled={isSubmitting} className="w-full gap-2">
                    <Send size={18} />
                    <span>{isSubmitting ? 'Оформляем...' : 'Подтвердить заказ'}</span>
                  </Button>
                ) : (
                  <Button onClick={() => setShowForm(true)} className="w-full gap-2">
                    <Send size={18} />
                    <span>Оформить заказ</span>
                  </Button>
                )}

                {!showForm && (
                  <button
                    onClick={clearCart}
                    className="w-full py-2 text-text-muted hover:text-blush-dark font-body text-sm transition-colors"
                  >
                    Очистить корзину
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
