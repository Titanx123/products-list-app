'use client';

import { useState, useEffect } from 'react';
import { Product, ProductFilters, ProductSort, PaginationParams } from '@/types';
import { formatPrice, formatDate, getStatusColor, getStockColor, formatDateTime } from '@/lib/utils';
import { Search, Filter, ChevronUp, ChevronDown, Eye, Edit, Trash2, Plus, X, AlertTriangle } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // State for filters, sorting, and pagination
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sort, setSort] = useState<ProductSort>({ sortBy: 'createdAt', sortOrder: 'desc' });
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stockQuantity: '',
    category: '',
    status: 'active' as const,
    vendor: '',
    description: ''
  });
  const [addingProduct, setAddingProduct] = useState(false);
  
  // View Product Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Edit Product Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    stockQuantity: '',
    category: '',
    status: 'active' as 'active' | 'inactive' | 'discontinued',
    vendor: '',
    description: ''
  });
  const [updatingProduct, setUpdatingProduct] = useState(false);
  
  // Delete Product Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder,
        ...(filters.category && { category: filters.category }),
        ...(filters.status && { status: filters.status }),
        ...(searchTerm && { search: searchTerm }),
      });
      
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data.products);
        setTotal(data.data.total);
        setTotalPages(data.data.totalPages);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [filters, sort, pagination, searchTerm]);
  
  // Handle search with debouncing
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  // Handle sorting
  const handleSort = (field: string) => {
    setSort(prev => ({
      sortBy: field as any,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };
  
  // Handle Add Product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.vendor) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      setAddingProduct(true);
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stockQuantity: parseInt(newProduct.stockQuantity) || 0,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Reset form and close modal
        setNewProduct({
          name: '',
          price: '',
          stockQuantity: '',
          category: '',
          status: 'active',
          vendor: '',
          description: ''
        });
        setShowAddModal(false);
        
        // Refresh products list
        fetchProducts();
        
        // Show success message
        alert('Product added successfully!');
      } else {
        alert(data.message || 'Failed to add product');
      }
    } catch (err) {
      alert('Failed to add product. Please try again.');
    } finally {
      setAddingProduct(false);
    }
  };
  
  // Handle View Product
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };
  
  // Handle Edit Product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      category: product.category,
      status: product.status,
      vendor: product.vendor,
      description: product.description || ''
    });
    setShowEditModal(true);
  };
  
  // Handle Update Product
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProduct) return;
    
    if (!editForm.name || !editForm.price || !editForm.category || !editForm.vendor) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      setUpdatingProduct(true);
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editForm,
          price: parseFloat(editForm.price),
          stockQuantity: parseInt(editForm.stockQuantity) || 0,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Close modal and refresh
        setShowEditModal(false);
        setEditingProduct(null);
        fetchProducts();
        
        // Show success message
        alert('Product updated successfully!');
      } else {
        alert(data.message || 'Failed to update product');
      }
    } catch (err) {
      alert('Failed to update product. Please try again.');
    } finally {
      setUpdatingProduct(false);
    }
  };
  
  // Handle Delete Product
  const handleDeleteProduct = (product: Product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };
  
  // Confirm Delete Product
  const confirmDeleteProduct = async () => {
    if (!deletingProduct) return;
    
    try {
      setDeleting(true);
      const response = await fetch(`/api/products/${deletingProduct.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Close modal and refresh
        setShowDeleteModal(false);
        setDeletingProduct(null);
        fetchProducts();
        
        // Show success message
        alert('Product deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (err) {
      alert('Failed to delete product. Please try again.');
    } finally {
      setDeleting(false);
    }
  };
  
  // Reset form when modal closes
  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewProduct({
      name: '',
      price: '',
      stockQuantity: '',
      category: '',
      status: 'active',
      vendor: '',
      description: ''
    });
  };
  
  // Close view modal
  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedProduct(null);
  };
  
  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    setEditForm({
      name: '',
      price: '',
      stockQuantity: '',
      category: '',
      status: 'active',
      vendor: '',
      description: ''
    });
  };
  
  // Close delete modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingProduct(null);
  };
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Products</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchProducts}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your product inventory with ease
              </p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name, vendor, or category..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={filters.category || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
                className="input"
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Sports">Sports</option>
                <option value="Books">Books</option>
                <option value="Automotive">Automotive</option>
                <option value="Health & Beauty">Health & Beauty</option>
                <option value="Toys">Toys</option>
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || undefined }))}
                className="input"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-2 hover:text-gray-700"
                    >
                      Name
                      {sort.sortBy === 'name' && (
                        sort.sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="table-header">
                    <button
                      onClick={() => handleSort('price')}
                      className="flex items-center gap-2 hover:text-gray-700"
                    >
                      Price
                      {sort.sortBy === 'price' && (
                        sort.sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="table-header">
                    <button
                      onClick={() => handleSort('stockQuantity')}
                      className="flex items-center gap-2 hover:text-gray-700"
                    >
                      Stock
                      {sort.sortBy === 'stockQuantity' && (
                        sort.sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Vendor</th>
                  <th className="table-header">
                    <button
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center gap-2 hover:text-gray-700"
                    >
                      Created At
                      {sort.sortBy === 'createdAt' && (
                        sort.sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: pagination.limit }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="table-cell">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </td>
                      <td className="table-cell">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="table-cell">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="table-cell">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="table-cell">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="table-cell">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="table-cell">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="table-cell">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="table-cell text-center py-12">
                      <div className="text-gray-500">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="table-cell">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={product.imageUrl || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=80&h=80&fit=crop`}
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="font-semibold">{formatPrice(product.price)}</span>
                      </td>
                      <td className="table-cell">
                        <span className={getStockColor(product.stockQuantity)}>
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm text-gray-900">{product.vendor}</span>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm text-gray-500">{formatDate(product.createdAt)}</span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewProduct(product)}
                            className="text-blue-600 hover:text-blue-900 p-1 transition-colors"
                            title="View Product"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="text-green-600 hover:text-green-900 p-1 transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product)}
                            className="text-red-600 hover:text-red-900 p-1 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!loading && products.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, total)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{total}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronUp className="h-5 w-5 transform rotate-90" />
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = Math.max(1, Math.min(totalPages - 4, pagination.page - 2)) + i;
                      if (page > totalPages) return null;
                      
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pagination.page
                              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronDown className="h-5 w-5 transform rotate-90" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Product</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    className="input w-full"
                    placeholder="Enter product name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    className="input w-full"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.stockQuantity}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stockQuantity: e.target.value }))}
                    className="input w-full"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="input w-full"
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home & Garden">Home & Garden</option>
                    <option value="Sports">Sports</option>
                    <option value="Books">Books</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Health & Beauty">Health & Beauty</option>
                    <option value="Toys">Toys</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    required
                    value={newProduct.status}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, status: e.target.value as any }))}
                    className="input w-full"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.vendor}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, vendor: e.target.value }))}
                    className="input w-full"
                    placeholder="Enter vendor name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    className="input w-full"
                    rows={3}
                    placeholder="Enter product description"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingProduct}
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {addingProduct ? 'Adding...' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
                <button
                  onClick={handleCloseViewModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={selectedProduct.imageUrl || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=200&h=200&fit=crop`}
                    alt={selectedProduct.name}
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{selectedProduct.name}</h4>
                  <p className="text-gray-600 text-sm">{selectedProduct.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Price:</span>
                    <p className="text-gray-900">{formatPrice(selectedProduct.price)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Stock:</span>
                    <p className={`${getStockColor(selectedProduct.stockQuantity)}`}>
                      {selectedProduct.stockQuantity}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <p className="text-gray-900">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedProduct.status)}`}>
                      {selectedProduct.status.charAt(0).toUpperCase() + selectedProduct.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Vendor:</span>
                    <p className="text-gray-900">{selectedProduct.vendor}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Created:</span>
                    <p className="text-gray-900">{formatDateTime(selectedProduct.createdAt)}</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={handleCloseViewModal}
                    className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Product</h3>
                <button
                  onClick={handleCloseEditModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="input w-full"
                    placeholder="Enter product name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={editForm.price}
                    onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                    className="input w-full"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.stockQuantity}
                    onChange={(e) => setEditForm(prev => ({ ...prev, stockQuantity: e.target.value }))}
                    className="input w-full"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="input w-full"
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home & Garden">Home & Garden</option>
                    <option value="Sports">Sports</option>
                    <option value="Books">Books</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Health & Beauty">Health & Beauty</option>
                    <option value="Toys">Toys</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    required
                    value={editForm.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="input w-full"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.vendor}
                    onChange={(e) => setEditForm(prev => ({ ...prev, vendor: e.target.value }))}
                    className="input w-full"
                    placeholder="Enter vendor name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="input w-full"
                    rows={3}
                    placeholder="Enter product description"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingProduct}
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {updatingProduct ? 'Updating...' : 'Update Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Product Modal */}
      {showDeleteModal && deletingProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Product</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete <strong>"{deletingProduct.name}"</strong>? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCloseDeleteModal}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteProduct}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 