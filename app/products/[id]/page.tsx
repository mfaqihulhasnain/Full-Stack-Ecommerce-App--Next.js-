import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { getProductById, getProductsByCategory } from "@/lib/data";
import { ProductGrid } from "@/components/product/product-grid";
import { ShoppingBag } from "lucide-react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { RawImage } from "@/components/ui/raw-image";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} - ShopEase`,
    description: product.description,
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  // Get related products from the same category, excluding current product
  const relatedProducts = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="py-8 md:py-12">
      <Container>
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border">
              <RawImage
                src={product.images[0] || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-md border cursor-pointer"
                  >
                    <RawImage
                      src={image}
                      alt={`${product.name} - image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div>
              <Link
                href={`/categories/${product.category.toLowerCase().replace(/ & /g, '-')}`}
                className="text-sm text-gray-500 hover:underline"
              >
                {product.category}
              </Link>
              <h1 className="text-3xl font-bold mt-2 mb-4">{product.name}</h1>
              <p className="text-2xl font-semibold mb-6">
                {formatCurrency(product.price)}
              </p>
              <div className="prose prose-gray mb-6">
                <p className="text-gray-600">{product.description}</p>
              </div>
            </div>

            {/* Product Options */}
            <div className="space-y-6">
              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant="outline"
                        size="sm"
                        className="min-w-[4rem]"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <Button
                        key={color}
                        variant="outline"
                        size="sm"
                        className="min-w-[4rem]"
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Note */}
              <div>
                <h3 className="text-sm font-medium mb-3">Quantity</h3>
                <p className="text-sm text-gray-500">
                  You can adjust the quantity in your cart.
                </p>
              </div>

              {/* Add to Cart Button */}
              <AddToCartButton product={product} />
            </div>

            {/* Product Meta */}
            <div className="mt-8 pt-8 border-t">
              <div className="text-sm text-gray-500 space-y-1">
                <p>
                  <span className="font-medium text-gray-700">Availability:</span>{" "}
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">You may also like</h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        )}
      </Container>
    </div>
  );
} 