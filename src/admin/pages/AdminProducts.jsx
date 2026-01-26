import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
  FiSave,
  FiToggleRight,
  FiToggleLeft,
} from "react-icons/fi";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from "../api/admin.products.api";
import { getAllCategories } from "../api/admin.categories.api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchName, setSearchName] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    categoryId: "",
    imageUrl: "",
    active: true,
  });

  // Load products and categories
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
      ]);
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
    } catch (err) {
      console.error("Failed to load data:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Filter products by search
  const filteredProducts = useMemo(
    () =>
      searchName.trim()
        ? products.filter((p) =>
            p.name.toLowerCase().includes(searchName.toLowerCase())
          )
        : products,
    [products, searchName]
  );

  // Handle form submission (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Better validation - check for empty strings and convert to numbers
    const price = parseFloat(formData.price);
    const stockQuantity = parseInt(formData.stockQuantity);

    if (
      !formData.name.trim() ||
      isNaN(price) ||
      price <= 0 ||
      isNaN(stockQuantity) ||
      stockQuantity < 0 ||
      !formData.categoryId
    ) {
      toast.error(
        !formData.name.trim()
          ? "Product name is required"
          : isNaN(price) || price <= 0
          ? "Price must be a valid number greater than 0"
          : isNaN(stockQuantity) || stockQuantity < 0
          ? "Stock quantity must be a valid number (0 or more)"
          : "Category is required"
      );
      return;
    }

    try {
      setLoading(true);
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: price,
        stockQuantity: stockQuantity,
        categoryId: parseInt(formData.categoryId),
        imageUrl: formData.imageUrl.trim(),
        active: formData.active,
      };

      if (editingId) {
        await updateProduct(editingId, productData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(productData);
        toast.success("Product created successfully");
      }

      resetForm();
      loadData();
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error(err.response?.data?.error || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      setLoading(true);
      const res = await deleteProduct(id);
      console.log("[DELETE] Product deleted successfully:", res.data);
      toast.success("Product deleted successfully");
      loadData();
    } catch (err) {
      console.error("[DELETE] Failed to delete product:", err);
      console.error("[DELETE] Error response:", err.response?.data);
      
      // Handle constraint/foreign key errors
      if (err.response?.status === 400 && err.response?.data?.error?.includes("constraint")) {
        toast.error("Cannot delete this product because it has related orders or cart items. Deactivate it instead.");
      } else {
        const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to delete product";
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await toggleProductStatus(id, !currentStatus);
      toast.success(!currentStatus ? "Product activated" : "Product deactivated");
      loadData();
    } catch (err) {
      console.error("Failed to toggle status:", err);
      toast.error("Failed to toggle status");
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      categoryId: product.category?.id?.toString() || "",
      imageUrl: product.imageUrl || "",
      active: product.active,
    });
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
      categoryId: "",
      imageUrl: "",
      active: true,
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 transition font-semibold w-full md:w-auto justify-center md:justify-start"
        >
          <FiPlus size={20} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-primary focus:outline-none flex-1"
        />
        {searchName && (
          <button
            onClick={() => setSearchName("")}
            className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Products Table - Desktop Only */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/60">
            {searchName ? `No products found with name "${searchName}"` : "No products yet"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white/70">Image</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white/70">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white/70">Category</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-white/70">Price</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-white/70">Stock</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-white/70">Status</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-white/70">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-white/5 transition">
                      <td className="px-4 py-3">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23444' width='100' height='100'/%3E%3C/svg%3E";
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center text-white/40 text-xs">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-white text-sm">{product.name}</td>
                      <td className="px-4 py-3 text-white/70 text-sm">{product.category?.name}</td>
                      <td className="px-4 py-3 text-right text-white/70 text-sm">
                        ₹{parseFloat(product.price).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-white/70 text-sm">{product.stockQuantity}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.active
                              ? "bg-green-500/20 text-green-200"
                              : "bg-red-500/20 text-red-200"
                          }`}
                        >
                          {product.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(product.id, product.active)}
                            className="p-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 transition"
                            title={product.active ? "Deactivate" : "Activate"}
                          >
                            {product.active ? (
                              <FiToggleRight size={18} />
                            ) : (
                              <FiToggleLeft size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary transition"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 transition"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                {/* Header with image and name */}
                <div className="flex gap-3">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23444' width='100' height='100'/%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-white/10 rounded flex items-center justify-center text-white/40 text-xs">
                      No Image
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm sm:text-base line-clamp-2">{product.name}</h3>
                    <p className="text-white/70 text-xs sm:text-sm">{product.category?.name}</p>
                    <p className="text-primary font-bold text-sm sm:text-base mt-1">₹{parseFloat(product.price).toFixed(2)}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 py-2 border-t border-b border-white/10">
                  <div>
                    <p className="text-white/50 text-xs">Stock</p>
                    <p className="text-white font-semibold text-sm">{product.stockQuantity}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Status</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        product.active
                          ? "bg-green-500/20 text-green-200"
                          : "bg-red-500/20 text-red-200"
                      }`}
                    >
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleToggleStatus(product.id, product.active)}
                    className="p-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 transition"
                    title={product.active ? "Deactivate" : "Activate"}
                  >
                    {product.active ? (
                      <FiToggleRight size={18} />
                    ) : (
                      <FiToggleLeft size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary transition"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 transition"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div onClick={resetForm} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <div className="relative bg-card border border-white/10 rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={resetForm}
                className="p-1 hover:bg-white/10 rounded-lg transition"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-primary focus:outline-none transition disabled:opacity-50"
                  placeholder="Product name"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-primary focus:outline-none transition disabled:opacity-50 h-24 resize-none"
                  placeholder="Product description"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg bg-black border border-primary/50 text-white focus:border-primary focus:outline-none transition disabled:opacity-50 font-medium"
                  style={{
                    colorScheme: "dark",
                    backgroundColor: "#1a1a1a",
                    color: "#ffffff",
                  }}
                >
                  <option value="" style={{ backgroundColor: "#1a1a1a", color: "#ffffff" }}>
                    Select category
                  </option>
                  {categories.map((cat) => (
                    <option
                      key={cat.id}
                      value={cat.id}
                      style={{
                        backgroundColor: "#2d2d2d",
                        color: "#ffffff",
                        padding: "10px",
                      }}
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-primary focus:outline-none transition disabled:opacity-50"
                  placeholder="0.00"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-primary focus:outline-none transition disabled:opacity-50"
                  placeholder="0"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-primary focus:outline-none transition disabled:opacity-50"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="mt-3 w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23333' width='100' height='100'/%3E%3Ctext fill='%23fff' x='50' y='50' text-anchor='middle' dy='.3em'%3EImage Error%3C/text%3E%3C/svg%3E";
                    }}
                  />
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition font-semibold disabled:opacity-50"
                >
                  <FiSave size={18} />
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
