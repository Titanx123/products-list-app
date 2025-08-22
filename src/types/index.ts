export interface Product {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  category: string;
  status: 'active' | 'inactive' | 'discontinued';
  vendor: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  imageUrl?: string;
}

export interface ProductFilters {
  category?: string;
  status?: string;
  search?: string;
}

export interface ProductSort {
  sortBy: 'name' | 'price' | 'stockQuantity' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface Status {
  id: string;
  name: string;
  count: number;
  color: string;
} 