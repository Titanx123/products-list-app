# Products List Dashboard

A modern, responsive products management dashboard built with Next.js, TypeScript, and Tailwind CSS. This application demonstrates a complete full-stack solution with both frontend and backend components in a single Next.js application.

## 🚀 Features

### Frontend
- **Responsive Design**: Mobile-first approach with fluid layouts
- **Modern UI**: Clean, professional interface following modern design principles
- **Interactive Table**: Sortable columns, pagination, and filtering
- **Real-time Search**: Debounced search functionality
- **Loading States**: Skeleton loaders and smooth transitions
- **Creative Enhancements**: 
  - Hover effects and micro-interactions
  - Color-coded status indicators
  - Stock level color coding
  - Smooth animations and transitions
  - Interactive sorting with visual indicators

### Backend
- **RESTful API**: Complete CRUD operations for products
- **Query Parameters**: Support for filtering, sorting, and pagination
- **Data Validation**: Input validation and error handling
- **Mock Data**: 100+ realistic product entries for testing

### Core Functionality
- Display paginated table of products (newest to oldest)
- Columns: Name, Price, Stock Quantity, Category, Status, Vendor
- Filtering by Category and Status
- Sorting by Price, Stock, Name, and Created At
- Search functionality across multiple fields
- Responsive pagination with smart page navigation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API**: Next.js API Routes

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd products-list-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📡 API Endpoints

### Base URL: `/api`

#### GET `/api/products`
Returns a paginated, sortable, filterable list of products.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `sortBy` (string): Sort field - 'name', 'price', 'stockQuantity', 'createdAt'
- `sortOrder` (string): Sort direction - 'asc' or 'desc'
- `category` (string): Filter by category
- `status` (string): Filter by status
- `search` (string): Search in name, vendor, or category

**Example Request:**
```bash
GET /api/products?page=1&limit=20&sortBy=price&sortOrder=desc&category=Electronics&status=active
```

**Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [...],
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

#### GET `/api/products/[id]`
Returns details of a specific product.

**Example Request:**
```bash
GET /api/products/prod-001
```

#### POST `/api/products`
Creates a new product.

**Request Body:**
```json
{
  "name": "Product Name",
  "price": 99.99,
  "stockQuantity": 100,
  "category": "Electronics",
  "status": "active",
  "vendor": "TechCorp"
}
```

#### PUT `/api/products/[id]`
Updates an existing product.

#### DELETE `/api/products/[id]`
Deletes a product.

## 🎨 Design Features

### Creative UI/UX Enhancements
1. **Smart Color Coding**: 
   - Stock levels: Red (0), Yellow (<10), Orange (<50), Green (≥50)
   - Status indicators with appropriate colors
   - Category badges with consistent styling

2. **Interactive Elements**:
   - Hover effects on table rows
   - Smooth transitions and animations
   - Visual feedback for sorting and filtering

3. **Responsive Design**:
   - Mobile-first approach
   - Adaptive table layout
   - Touch-friendly controls

4. **Loading States**:
   - Skeleton loaders during data fetch
   - Smooth transitions between states
   - Meaningful empty states

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile**: Stacked layout, simplified navigation
- **Tablet**: Optimized grid layouts
- **Desktop**: Full-featured interface with all controls visible

## 🔍 Search & Filtering

- **Real-time Search**: Debounced search across product names, vendors, and categories
- **Category Filter**: Dropdown selection for product categories
- **Status Filter**: Filter by product status (active, inactive, discontinued)
- **Combined Filters**: Multiple filters work together seamlessly

## 📊 Data Management

### Mock Data Structure
The application includes 100+ realistic product entries with:
- Varied categories (Electronics, Clothing, Home & Garden, etc.)
- Different statuses and stock levels
- Realistic pricing and vendor information
- Timestamps for creation and updates

### Data Persistence
- Currently uses in-memory mock data
- Ready for database integration (MongoDB, PostgreSQL, etc.)
- API endpoints support full CRUD operations

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. API routes work out of the box

### Other Platforms
- **Netlify**: Build and deploy with `npm run build`
- **Docker**: Use the provided Dockerfile
- **Self-hosted**: Standard Node.js deployment

## 🧪 Testing

### Manual Testing
- Test all filter combinations
- Verify sorting on different columns
- Check pagination functionality
- Test responsive design on various devices

### Automated Testing (Future Enhancement)
- Unit tests for utility functions
- Integration tests for API endpoints
- E2E tests for user workflows

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for custom configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Products Dashboard
```

### Tailwind Configuration
Custom colors and animations are defined in `tailwind.config.js`:
- Primary color palette
- Custom animations (fade-in, slide-up, bounce-in)
- Responsive breakpoints

## 📈 Performance

- **Optimized Rendering**: React 18 features for better performance
- **Lazy Loading**: Images and components load as needed
- **Efficient State Management**: Minimal re-renders with proper hooks usage
- **API Optimization**: Efficient data fetching with proper caching

## 🎯 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication and authorization
- [ ] Advanced analytics and reporting
- [ ] Bulk operations (import/export)
- [ ] Real-time updates with WebSockets
- [ ] Dark mode theme
- [ ] Advanced search with filters
- [ ] Product image management
- [ ] Audit logging
- [ ] API rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built with Next.js and React
- Styled with Tailwind CSS
- Icons from Lucide React
- Design inspiration from modern dashboard patterns

---

**Note**: This project was developed as a demonstration of modern web development practices and can serve as a foundation for production applications. 