import { NextRequest, NextResponse } from 'next/server';
import { mockProducts, filterAndSortProducts, generateCategories, generateStatuses } from '@/lib/mock-data';
import { ProductsResponse, ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    
    // Validate parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, message: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }
    
    // Filter and sort products
    const result = filterAndSortProducts(
      mockProducts,
      { category, status, search },
      { sortBy, sortOrder },
      { page, limit }
    );
    
    const response: ApiResponse<ProductsResponse> = {
      success: true,
      message: 'Products retrieved successfully',
      data: result
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.price || !body.category || !body.status || !body.vendor) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate price and stock quantity
    if (isNaN(body.price) || body.price < 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid price' },
        { status: 400 }
      );
    }
    
    if (body.stockQuantity && (isNaN(body.stockQuantity) || body.stockQuantity < 0)) {
      return NextResponse.json(
        { success: false, message: 'Invalid stock quantity' },
        { status: 400 }
      );
    }
    
    // Create new product
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: body.name,
      price: parseFloat(body.price),
      stockQuantity: parseInt(body.stockQuantity) || 0,
      category: body.category,
      status: body.status,
      vendor: body.vendor,
      description: body.description || '',
      imageUrl: body.imageUrl || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=400&h=400&fit=crop`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to mock data (in a real app, you'd save to database)
    mockProducts.unshift(newProduct); // Add to beginning to show newest first
    
    return NextResponse.json(
      { success: true, message: 'Product created successfully', data: newProduct },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 