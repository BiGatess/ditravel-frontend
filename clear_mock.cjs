const fs = require('fs');
const files = [
  'src/pages/SearchPage.tsx',
  'src/pages/admin/UsersPage.tsx',
  'src/pages/admin/ReviewsPage.tsx',
  'src/pages/admin/ProductsPage.tsx',
  'src/pages/admin/PricingPage.tsx',
  'src/pages/admin/OrdersPage.tsx',
  'src/pages/admin/PlacesPage.tsx',
  'src/pages/admin/LocationsPage.tsx',
  'src/pages/admin/BannersPage.tsx',
  'src/components/profile/BookingHistory.tsx',
  'src/components/blog/BlogList.tsx'
];

files.forEach(f => {
  try {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const MOCK_PRODUCTS(:\s*any\[\])?\s*=\s*\[[\s\S]*?\];/g, 'const MOCK_PRODUCTS: any[] = [];');
    content = content.replace(/const MOCK_USERS:\s*User\[\]\s*=\s*\[[\s\S]*?\];/g, 'const MOCK_USERS: User[] = [];');
    content = content.replace(/const MOCK_REVIEWS:\s*Review\[\]\s*=\s*\[[\s\S]*?\];/g, 'const MOCK_REVIEWS: Review[] = [];');
    content = content.replace(/const INITIAL_PRODUCTS\s*=\s*\[[\s\S]*?\];/g, 'const INITIAL_PRODUCTS: any[] = [];');
    content = content.replace(/const MOCK_PLACES(:\s*Place\[\])?\s*=\s*\[[\s\S]*?\];/g, 'const MOCK_PLACES: any[] = [];');
    content = content.replace(/const MOCK_OPTIONS:\s*Record<string, {id: string, name: string}\[\]>\s*=\s*\{[\s\S]*?\};/g, 'const MOCK_OPTIONS: Record<string, {id: string, name: string}[]> = {};');
    content = content.replace(/const MOCK_ORDERS(:\s*Order\[\])?\s*=\s*\[[\s\S]*?\];/g, 'const MOCK_ORDERS: any[] = [];');
    content = content.replace(/const MOCK_LOCATIONS(:\s*Location\[\])?\s*=\s*\[[\s\S]*?\];/g, 'const MOCK_LOCATIONS: any[] = [];');
    content = content.replace(/const MOCK_BANNERS:\s*Banner\[\]\s*=\s*\[[\s\S]*?\];/g, 'const MOCK_BANNERS: Banner[] = [];');
    content = content.replace(/const MOCK_BLOGS\s*=\s*\[[\s\S]*?\];/g, 'const MOCK_BLOGS: any[] = [];');
    content = content.replace(/const generateMockData\s*=\s*\(\)\s*=>\s*\{[\s\S]*?return data;\n};/g, 'const generateMockData = () => ({});');
    fs.writeFileSync(f, content);
    console.log(`Cleaned ${f}`);
  } catch (e) {
    console.log(`Skipped or failed ${f}: ${e.message}`);
  }
});
