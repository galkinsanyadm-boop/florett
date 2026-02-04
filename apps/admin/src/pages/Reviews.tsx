import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Trash2, Star } from 'lucide-react';
import { fetchReviews, approveReview, deleteReview } from '@/lib/api';
import { cn } from '@/lib/utils';

export function ReviewsPage() {
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) => approveReview(id, approved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  const handleApprove = (id: string, approved: boolean) => {
    approveMutation.mutate({ id, approved });
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить этот отзыв?')) {
      deleteMutation.mutate(id);
    }
  };

  const pendingReviews = (reviews as any[])?.filter((r) => !r.isApproved) || [];
  const approvedReviews = (reviews as any[])?.filter((r) => r.isApproved) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Отзывы</h1>
        <p className="text-gray-500 mt-1">Модерация отзывов клиентов</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Загрузка...</div>
      ) : (
        <>
          {/* Pending Reviews */}
          {pendingReviews.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                На модерации ({pendingReviews.length})
              </h2>
              <div className="grid gap-4">
                {pendingReviews.map((review: any) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onApprove={() => handleApprove(review.id, true)}
                    onReject={() => handleApprove(review.id, false)}
                    onDelete={() => handleDelete(review.id)}
                    isPending
                  />
                ))}
              </div>
            </div>
          )}

          {/* Approved Reviews */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Опубликованные ({approvedReviews.length})
            </h2>
            {approvedReviews.length === 0 ? (
              <div className="text-center py-8 text-gray-400 bg-white rounded-xl border border-gray-100">
                Нет опубликованных отзывов
              </div>
            ) : (
              <div className="grid gap-4">
                {approvedReviews.map((review: any) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onDelete={() => handleDelete(review.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface ReviewCardProps {
  review: any;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete: () => void;
  isPending?: boolean;
}

function ReviewCard({ review, onApprove, onReject, onDelete, isPending }: ReviewCardProps) {
  return (
    <div className={cn(
      'bg-white rounded-xl p-6 shadow-sm border',
      isPending ? 'border-yellow-200' : 'border-gray-100'
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-semibold text-gray-900">{review.author}</span>
            <span className="text-sm text-gray-400">{review.date}</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}
                />
              ))}
            </div>
            {review.highlight && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                Избранный
              </span>
            )}
          </div>
          <p className="text-gray-600 leading-relaxed">{review.text}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isPending && (
            <>
              <button
                onClick={onApprove}
                className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition"
                title="Одобрить"
              >
                <Check size={18} />
              </button>
              <button
                onClick={onReject}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition"
                title="Отклонить"
              >
                <X size={18} />
              </button>
            </>
          )}
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition"
            title="Удалить"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
