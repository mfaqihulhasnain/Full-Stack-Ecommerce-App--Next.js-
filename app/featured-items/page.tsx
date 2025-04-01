import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-grid";
import { getFeaturedProducts } from "@/lib/data";

export const metadata = {
  title: "Featured Items - ShopEase",
  description: "Explore our hand-picked selection of featured products.",
};

export default function FeaturedItemsPage() {
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="py-8 md:py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Featured Items</h1>
          <p className="text-gray-600">
            Discover our specially curated collection of high-quality, standout products.
          </p>
        </div>

        {featuredProducts.length > 0 ? (
          <ProductGrid products={featuredProducts} />
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">No featured items available at the moment. Check back soon!</p>
          </div>
        )}
      </Container>
    </div>
  );
} 