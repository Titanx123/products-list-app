import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/lib/mock-data';
import { ApiResponse, Product } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const product = mockProducts.find(p => p.id === id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    const response: ApiResponse<Product> = {
      success: true,
      message: 'Product retrieved successfully',
      data: product
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const productIndex = mockProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Validate required fields
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
    
    // Update product
    const updatedProduct = {
      ...mockProducts[productIndex],
      ...body,
      price: parseFloat(body.price),
      stockQuantity: parseInt(body.stockQuantity) || 0,
      updatedAt: new Date().toISOString(),
    };
    
    // Update in mock data
    mockProducts[productIndex] = updatedProduct;
    
    return NextResponse.json(
      { success: true, message: 'Product updated successfully', data: updatedProduct }
    );
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const productIndex = mockProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Remove from mock data
    const deletedProduct = mockProducts[productIndex];
    mockProducts.splice(productIndex, 1);
    
    return NextResponse.json(
      { success: true, message: 'Product deleted successfully', data: deletedProduct }
    );
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 