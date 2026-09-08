import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useShop } from "@/lib/store";
import { ShieldCheck, Truck, RotateCcw, Check, Zap, Flame } from "lucide-react";

export function ProductDetailPage() {
  const params = useParams({ strict: false }) as any;
  const targetId = params?.productId || params?.id;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeImage, setActiveImage] = useState("");
  const [added, setAdded] = useState(false);
  const { addToCart } = useShop();

  useEffect(() => {
    async function fetchProductDetails() {
      if (!targetId) return;
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || "https://dwell-trends-backend.vercel.app/api/v1";
        const res = await fetch(`${API_URL}/products/${targetId}`);
        const data = await res.json();

        if (data.success && data.product) {
          setProduct(data.product);
          if (data.product.images?.length > 0) {
            setActiveImage(data.product.images[0].url);
          }
          if (data.product.variants?.length > 0) {
            setSelectedVariant(data.product.variants[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProductDetails();
  }, [targetId]);

  if (loading) {
    return <div className="text-center py-28 text-xs text-muted-foreground">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center py-28 text-xs text-muted-foreground">Product not found.</div>;
  }

  // Calculate dynamic deal price override
  const isDealActive = product.dealType && product.dealType !== "None" && product.dealPrice;
  const effectivePrice = isDealActive ? product.dealPrice : product.price;
  const originalMrp = product.mrp || product.price;
  const discountPercent = Math.round(((originalMrp - effectivePrice) / originalMrp) * 100);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product._id,
      size: selectedVariant?.size || "Standard",
      colour: selectedVariant?.colourName || "Default",
      qty: 1,
      price: effectivePrice, // Pass active deal price to cart
      mrp: originalMrp,
      productDetails: {
        ...product,
        price: effectivePrice, // Override cart rendering price
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container-page py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-secondary/20 rounded-2xl overflow-hidden border border-border">
            <img
              src={activeImage || product.images?.[0]?.url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img.url)}
                  className={`aspect-[3/4] rounded-lg overflow-hidden border transition-all ${
                    activeImage === img.url
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Actions */}
        <div className="space-y-6">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
              {product.brand || "Dwell Trends"} • {product.mainCategory || "Collection"} / {product.subCategory || product.category}
            </span>
            <h1 className="font-display text-3xl font-bold mt-1 text-foreground">{product.name}</h1>
          </div>

          {/* Pricing & Deal Badges */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">₹{effectivePrice}</span>
              {originalMrp > effectivePrice && (
                <span className="text-base text-muted-foreground line-through">₹{originalMrp}</span>
              )}
              {discountPercent > 0 && (
                <span className="bg-green-500/10 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Flipkart/Myntra WOW Deal Banner */}
            {product.dealType === "Wow" && (
              <div className="rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-3.5 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-400 text-black text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                      WOW DEAL
                    </span>
                    <span className="text-sm font-bold">Buy at ₹{product.dealPrice}</span>
                  </div>
                  <Zap className="h-4 w-4 fill-amber-300 text-amber-300" />
                </div>
                <p className="text-[11px] text-blue-100 mt-1">
                  Special flash promotion applied! Grab it before stock runs out.
                </p>
              </div>
            )}

            {/* Hot Deal Tag */}
            {product.dealType === "Hot" && (
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <Flame className="h-3.5 w-3.5 text-amber-600 fill-amber-500" />
                <span>Hot Deal Price Applied</span>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Specifications */}
          {(product.fabric || product.work) && (
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-border text-xs">
              {product.fabric && (
                <div>
                  <span className="text-muted-foreground block">Fabric</span>
                  <span className="font-semibold mt-0.5 block">{product.fabric}</span>
                </div>
              )}
              {product.work && (
                <div>
                  <span className="text-muted-foreground block">Work Type</span>
                  <span className="font-semibold mt-0.5 block">{product.work}</span>
                </div>
              )}
            </div>
          )}

          {/* Variant Selection */}
          {product.variants?.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider block">
                Select Size & Color:{" "}
                <span className="text-primary font-normal">
                  {selectedVariant?.size} / {selectedVariant?.colourName}
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any, i: number) => {
                  const isSelected =
                    selectedVariant?.size === v.size && selectedVariant?.colourName === v.colourName;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2.5 rounded-xl text-xs border transition-all flex items-center gap-2 ${
                        isSelected
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-border"
                        style={{ backgroundColor: v.colourHex || "#000" }}
                      />
                      {v.size} — {v.colourName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-primary text-primary-foreground rounded-full text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            {added ? (
              <>
                <Check className="h-4 w-4" /> Added to Cart
              </>
            ) : (
              `Add to Cart — ₹${effectivePrice}`
            )}
          </button>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border text-center">
            <div className="p-3 bg-secondary/20 rounded-xl">
              <Truck className="h-4 w-4 mx-auto mb-1 text-primary" />
              <span className="text-[10px] text-muted-foreground block font-medium">Free Shipping</span>
            </div>
            <div className="p-3 bg-secondary/20 rounded-xl">
              <RotateCcw className="h-4 w-4 mx-auto mb-1 text-primary" />
              <span className="text-[10px] text-muted-foreground block font-medium">7-Day Returns</span>
            </div>
            <div className="p-3 bg-secondary/20 rounded-xl">
              <ShieldCheck className="h-4 w-4 mx-auto mb-1 text-primary" />
              <span className="text-[10px] text-muted-foreground block font-medium">100% Authentic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}