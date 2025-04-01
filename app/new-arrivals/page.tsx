import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-grid";
import { getNewArrivals } from "@/lib/data";

export const metadata = {
  title: "New Arrivals - ShopEase",
  description: "Discover our latest products and stay ahead of the trends.",
};

export default function NewArrivalsPage() {
  const newProducts = getNewArrivals();

  return (
    <div className="py-8 md:py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">New Arrivals</h1>
          <p className="text-gray-600">
            Check out our newest products and be the first to discover the latest trends.
          </p>
        </div>

        {newProducts.length > 0 ? (
          <ProductGrid products={newProducts} />
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">New products coming soon! Check back later.</p>
          </div>
        )}
      </Container>
    </div>
  );
} 