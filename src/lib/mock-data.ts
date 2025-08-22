import { Product, Category, Status } from '@/types';

// Generate mock products
const generateMockProducts = (): Product[] => {
  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Automotive', 'Health & Beauty', 'Toys'];
  const statuses: Array<'active' | 'inactive' | 'discontinued'> = ['active', 'inactive', 'discontinued'];
  const vendors = ['TechCorp', 'FashionHub', 'HomeStyle', 'SportZone', 'BookWorld', 'AutoParts', 'BeautyCare', 'ToyLand'];
  
  const products: Product[] = [];
  
  for (let i = 1; i <= 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    
    const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const updatedAt = new Date(createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    products.push({
      id: `prod-${i.toString().padStart(3, '0')}`,
      name: `${category} Product ${i}`,
      price: Math.round((Math.random() * 1000 + 10) * 100) / 100,
      stockQuantity: Math.floor(Math.random() * 1000) + 1,
      category,
      status,
      vendor,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      description: `This is a ${category.toLowerCase()} product with high quality and great features.`,
      imageUrl: `https://picsum.photos/400/400?random=${i}`
    });
  }
  
  return products;
};

export const mockProducts = generateMockProducts();

// Generate categories with counts
export const generateCategories = (): Category[] => {
  const categoryCounts = mockProducts.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(categoryCounts).map(([name, count]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    count
  }));
};

// Generate statuses with counts and colors
export const generateStatuses = (): Status[] => {
  const statusCounts = mockProducts.reduce((acc, product) => {
    acc[product.status] = (acc[product.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const statusColors = {
    active: 'green',
    inactive: 'yellow',
    discontinued: 'red'
  };
  
  return Object.entries(statusCounts).map(([name, count]) => ({
    id: name,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count,
    color: statusColors[name as keyof typeof statusColors]
  }));
};

// Filter and sort products
export const filterAndSortProducts = (
  products: Product[],
  filters: { category?: string; status?: string; search?: string },
  sort: { sortBy: string; sortOrder: 'asc' | 'desc' },
  pagination: { page: number; limit: number }
) => {
  let filtered = [...products];
  
  // Apply filters
  if (filters.category) {
    filtered = filtered.filter(product => product.category === filters.category);
  }
  
  if (filters.status) {
    filtered = filtered.filter(product => product.status === filters.status);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.vendor.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply sorting
  filtered.sort((a, b) => {
    let aValue: any = a[sort.sortBy as keyof Product];
    let bValue: any = b[sort.sortBy as keyof Product];
    
    if (sort.sortBy === 'createdAt' || sort.sortBy === 'updatedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (aValue < bValue) return sort.sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sort.sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Apply pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / pagination.limit);
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  const paginatedProducts = filtered.slice(startIndex, endIndex);
  
  return {
    products: paginatedProducts,
    total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages
  };
}; 