import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useShop } from "@/lib/store";
import { ShieldCheck, Truck, RotateCcw, Check } from "lucide-react";

export function ProductDetailPage() {
  const { productId } = useParams({ from: "/product/$productId" });
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeImage, setActiveImage] = useState("");
  const [added, setAdded] = useState(false);
  const { addToCart } = useShop();

  useEffect(() => {
    async function fetchProductDetails() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/v1/products/${productId}`);
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
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product._id,
      size: selectedVariant?.size || "Standard",
      colour: selectedVariant?.colourName || "Default",
      qty: 1,
      productDetails: product, // Cached for easy cart summary rendering
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return <div className="text-center py-28 text-xs text-muted-foreground">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center py-28 text-xs text-muted-foreground">Product not found.</div>;
  }

  return (
    <div className="container-page py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-secondary/20 rounded-2xl overflow-hidden border border-border">
            <img src={activeImage || product.images?.[0]?.url} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img.url)}
                  className={`aspect-[3/4] rounded-lg overflow-hidden border transition-all ${
                    activeImage === img.url ? "border-primary ring-2 ring-primary/20" : "border-border opacity-70 hover:opacity-100"
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
              {product.brand || "Saanvi Fashion"} • {product.category}
            </span>
            <h1 className="font-display text-3xl font-bold mt-1">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-primary">₹{product.price}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-sm text-muted-foreground line-through">₹{product.mrp}</span>
            )}
            {product.mrp && product.mrp > product.price && (
              <span className="bg-primary/10 text-primary text-[10px] uppercase px-2 py-0.5 rounded font-semibold tracking-wider">
                {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% Off
              </span>
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
                Select Size & Color: <span className="text-primary font-normal">{selectedVariant?.size} / {selectedVariant?.colourName}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any, i: number) => {
                  const isSelected = selectedVariant?.size === v.size && selectedVariant?.colourName === v.colourName;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2.5 rounded-xl text-xs border transition-all flex items-center gap-2 ${
                        isSelected ? "border-primary bg-primary/10 font-semibold text-primary" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-border" style={{ backgroundColor: v.colourHex || "#000" }} />
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
            className="w-full py-4 bg-primary text-primary-foreground rounded-full text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            {added ? <><Check className="h-4 w-4" /> Added to Cart</> : "Add to Cart"}
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
              <span className="text-[10px] text-muted-foreground block font-medium">Secure Pay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}