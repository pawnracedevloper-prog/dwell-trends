import { useState } from "react";
import { Plus, Trash2, ShieldCheck } from "lucide-react";

export function AdminDashboard() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [fabric, setFabric] = useState("");
  const [work, setWork] = useState("");
  const [detailsText, setDetailsText] = useState("");
  
  // Variants state: size, color name, hex, stock
  const [variants, setVariants] = useState([
    { size: "S", colourName: "Red", colourHex: "#FF0000", stock: 10, sku: "" }
  ]);
  
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const addVariant = () => {
    setVariants([...variants, { size: "M", colourName: "", colourHex: "#000000", stock: 10, sku: "" }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("mrp", mrp);
      formData.append("fabric", fabric);
      formData.append("work", work);
      formData.append("variants", JSON.stringify(variants));
      
      const detailsArray = detailsText.split("\n").filter(Boolean);
      formData.append("details", JSON.stringify(detailsArray));

      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
      }

      // Use VITE_API_URL or fallback to deployed backend URL
      const API_URL = import.meta.env.VITE_API_URL || "https://dwell-trends-backend.vercel.app/api/v1";
      const token = localStorage.getItem("token");
      
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create product");

      setMessage("Product added successfully to MongoDB & Cloudinary!");
      // Reset form
      setName("");
      setCategory("");
      setDescription("");
      setPrice("");
      setMrp("");
      setFabric("");
      setWork("");
      setDetailsText("");
      setImages(null);
      setVariants([{ size: "S", colourName: "Red", colourHex: "#FF0000", stock: 10, sku: "" }]);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-10 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <h1 className="font-display text-2xl font-bold">Admin Inventory Dashboard</h1>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg text-xs font-medium ${message.includes("success") ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border p-8 rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium mb-1 block">Product Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="h-10 w-full rounded-md border border-border bg-secondary/30 px-3 text-xs outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Category</label>
            <input required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. kurtis, lehengas" className="h-10 w-full rounded-md border border-border bg-secondary/30 px-3 text-xs outline-none focus:border-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium mb-1 block">Selling Price (₹)</label>
            <input required type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="h-10 w-full rounded-md border border-border bg-secondary/30 px-3 text-xs outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">MRP (₹)</label>
            <input required type="number" value={mrp} onChange={(e) => setMrp(e.target.value)} className="h-10 w-full rounded-md border border-border bg-secondary/30 px-3 text-xs outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Upload Images (Max 5)</label>
            <input type="file" multiple onChange={(e) => setImages(e.target.files)} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium mb-1 block">Description</label>
          <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-md border border-border bg-secondary/30 p-3 text-xs outline-none focus:border-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium mb-1 block">Fabric</label>
            <input value={fabric} onChange={(e) => setFabric(e.target.value)} placeholder="e.g. Pure Silk" className="h-10 w-full rounded-md border border-border bg-secondary/30 px-3 text-xs outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Work Type</label>
            <input value={work} onChange={(e) => setWork(e.target.value)} placeholder="e.g. Zari Embroidery" className="h-10 w-full rounded-md border border-border bg-secondary/30 px-3 text-xs outline-none focus:border-primary" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium mb-1 block">Bullet Details (One per line)</label>
          <textarea rows={2} value={detailsText} onChange={(e) => setDetailsText(e.target.value)} placeholder="Dry clean only&#10;Made in India" className="w-full rounded-md border border-border bg-secondary/30 p-3 text-xs outline-none focus:border-primary" />
        </div>

        {/* Variant Stock Manager */}
        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider">Size & Color Variants (Inventory)</h3>
            <button type="button" onClick={addVariant} className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
              <Plus className="h-3.5 w-3.5" /> Add Variant
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((v, index) => (
              <div key={index} className="flex items-center gap-2 bg-secondary/20 p-3 rounded-lg border border-border">
                <input placeholder="Size (e.g. S, M, L)" value={v.size} onChange={(e) => handleVariantChange(index, "size", e.target.value)} className="h-9 w-24 rounded border border-border bg-card px-2 text-xs" />
                <input placeholder="Color Name" value={v.colourName} onChange={(e) => handleVariantChange(index, "colourName", e.target.value)} className="h-9 w-28 rounded border border-border bg-card px-2 text-xs" />
                <input type="color" value={v.colourHex} onChange={(e) => handleVariantChange(index, "colourHex", e.target.value)} className="h-9 w-12 rounded border border-border bg-card p-1 cursor-pointer" />
                <input placeholder="Stock Qty" type="number" value={v.stock} onChange={(e) => handleVariantChange(index, "stock", Number(e.target.value))} className="h-9 w-24 rounded border border-border bg-card px-2 text-xs" />
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(index)} className="text-destructive hover:opacity-80 p-2">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-95 disabled:opacity-50">
          {loading ? "Uploading to Cloudinary & Saving..." : "Publish Product"}
        </button>
      </form>
    </div>
  );
}