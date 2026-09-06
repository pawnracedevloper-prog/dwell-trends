import { useState, useEffect } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Star, Truck, ShieldCheck, ArrowLeft, Ruler } from "lucide-react";
import { getProduct, inr, discountPercent, type Product } from "@/lib/products";
import { useShop } from "@/lib/store";

export function ProductDetailPage() {
  const { productId } = useParams({ strict: false }) as { productId: string };
  const product = getProduct(productId);
  
  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-2xl">Product not found</h1>
        <Link to="/products" className="mt-4 text-primary hover:underline">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return <ProductView product={product} />;
}

function ProductView({ product }: { product: Product }) {
  const { addToCart, wishlist, toggleWishlist } = useShop();
  
  // State
  const [activeImg, setActiveImg] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColour, setSelectedColour] = useState<string>(product.colours[0]?.name || "");
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const isWished = wishlist.includes(product.id);

  // Reset state if product changes
  useEffect(() => {
    setActiveImg(product.images[0]);
    setSelectedSize("");
    setSelectedColour(product.colours[0]?.name || "");
  }, [product]);

  function handleAdd() {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }
    if (!selectedColour) {
      setError("Please select a color");
      return;
    }
    
    setError("");
    addToCart({
      id: product.id,
      size: selectedSize,
      colour: selectedColour,
      qty: 1,
    });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="container-page py-6 sm:py-10">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to {product.category}
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Left: Image Gallery */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          <div className="flex gap-3 overflow-x-auto sm:flex-col sm:overflow-y-auto hide-scrollbar sm:w-20">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(img)}
                className={`relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                  activeImg === img ? "border-rose-deep opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`${product.name} view ${i + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="relative aspect-[3/4] flex-1 overflow-hidden rounded-2xl bg-muted border border-border/50">
            <img
              src={activeImg}
              alt={product.name}
              className="h-full w-full object-cover transition-all duration-500"
            />
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col pt-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="eyebrow text-muted-foreground">{product.brand}</span>
            <div className="flex items-center gap-1 text-sm font-medium">
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span>{product.rating}</span>
              <span className="text-muted-foreground">({product.ratingCount})</span>
            </div>
          </div>
          
          <h1 className="font-display text-2xl text-foreground sm:text-3xl lg:text-4xl leading-tight">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold">{inr(product.price)}</span>
            <span className="text-sm text-muted-foreground line-through">{inr(product.mrp)}</span>
            <span className="text-sm font-semibold text-rose-deep bg-rose-deep/10 px-2 py-0.5 rounded">
              {discountPercent(product)}% OFF
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

          <div className="my-8 h-px w-full bg-border/70" />

          {/* Color Selection */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between text-sm font-medium">
              <span>Color: <span className="text-muted-foreground">{selectedColour}</span></span>
            </div>
            <div className="flex gap-3">
              {product.colours.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColour(c.name)}
                  aria-label={`Select ${c.name}`}
                  className={`grid h-10 w-10 place-items-center rounded-full border-2 transition-all ${
                    selectedColour === c.name ? "border-primary scale-110" : "border-transparent hover:scale-105"
                  }`}
                >
                  <span
                    className="h-7 w-7 rounded-full shadow-inner border border-black/10"
                    style={{ backgroundColor: c.hex }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between text-sm font-medium">
              <span>Size</span>
              <button className="flex items-center gap-1 text-xs text-rose-deep hover:underline">
                <Ruler className="h-3 w-3" /> Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSelectedSize(s);
                    setError("");
                  }}
                  className={`flex h-11 min-w-[3rem] items-center justify-center rounded-lg border px-4 text-sm font-semibold transition-all ${
                    selectedSize === s
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {error && <p className="mt-2 text-xs font-medium text-destructive">{error}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAdd}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <ShoppingBag className="h-4 w-4" />
              {added ? "Added to Bag" : "Add to Bag"}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border bg-card transition-colors hover:bg-accent"
            >
              <Heart className={`h-5 w-5 ${isWished ? "fill-rose-deep text-rose-deep" : "text-foreground"}`} />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mb-8 grid grid-cols-2 gap-4 rounded-xl border border-border bg-secondary/30 p-4 text-xs">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Truck className="h-4 w-4 text-primary" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Authentic Fabric</span>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="font-semibold uppercase tracking-wide">Description</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-border/70 pt-6">
              <div>
                <span className="text-muted-foreground block text-xs">Fabric</span>
                <span className="font-medium">{product.fabric}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Work</span>
                <span className="font-medium">{product.work}</span>
              </div>
            </div>

            <div className="border-t border-border/70 pt-6">
              <h3 className="font-semibold uppercase tracking-wide mb-3">Details</h3>
              <ul className="list-inside list-disc space-y-1.5 text-muted-foreground">
                {product.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}