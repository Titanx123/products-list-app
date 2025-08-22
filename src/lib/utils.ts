export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'discontinued':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getStockColor(quantity: number): string {
  if (quantity === 0) return 'text-red-600 font-semibold';
  if (quantity < 10) return 'text-yellow-600 font-semibold';
  if (quantity < 50) return 'text-orange-600 font-semibold';
  return 'text-green-600 font-semibold';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 