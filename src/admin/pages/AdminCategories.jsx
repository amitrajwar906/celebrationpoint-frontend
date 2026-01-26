import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiToggleRight,
  FiToggleLeft,
} from "react-icons/fi";

import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "../api/admin.categories.api";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  /* ================= LOAD CATEGORIES ================= */
  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await getAllCategories();

      const data = Array.isArray(res.data) ? res.data : [];
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error("Category name required");
      return;
    }

    try {
      await createCategory({ name: newName.trim() });
      toast.success("Category created");
      setNewName("");
      loadCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create category");
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async (id) => {
    if (!editingName.trim()) return;

    try {
      await updateCategory(id, { name: editingName.trim() });
      toast.success("Category updated");
      setEditingId(null);
      setEditingName("");
      loadCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update category");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      toast.success("Category deleted");
      loadCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };

  /* ================= TOGGLE STATUS (ACTIVATE/DEACTIVATE) ================= */
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? "activate" : "deactivate";

    try {
      console.log(`[ADMIN CATEGORY] Starting toggle for category ${id}`);
      console.log(`[ADMIN CATEGORY] Current status: ${currentStatus}, New status: ${newStatus}`);
      
      await toggleCategoryStatus(id, newStatus);
      
      console.log(`[ADMIN CATEGORY] ✅ Successfully ${action}d category ${id}`);
      toast.success(`Category ${action}d successfully`);
      loadCategories();
    } catch (err) {
      console.error(`[ADMIN CATEGORY] ❌ Failed to ${action} category ${id}:`, err);
      console.error("[ADMIN CATEGORY] Error response status:", err.response?.status);
      console.error("[ADMIN CATEGORY] Error response data:", err.response?.data);
      
      let errorMsg = "Network error - Is backend running?";
      if (err.response?.status === 404) {
        errorMsg = "Category not found";
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      toast.error(`Failed to ${action} category: ${errorMsg}`);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
      </div>

      {/* Add Category */}
      <div className="flex gap-3 max-w-lg">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          className="flex-1 bg-[#0b1020] border border-white/10 rounded-xl px-4 py-2 outline-none"
        />
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-black shadow-glow"
        >
          <FiPlus />
          Add
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-white/60">No categories found</p>
      ) : (
        <div className="rounded-xl border border-white/10 divide-y divide-white/10">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition"
            >
              {/* Name & Status */}
              <div className="flex items-center gap-3 flex-1">
                {editingId === cat.id ? (
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="bg-[#0b1020] border border-white/10 rounded-lg px-3 py-1 outline-none"
                  />
                ) : (
                  <>
                    <span className="font-medium">{cat.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      cat.active 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {cat.active ? "Active" : "Inactive"}
                    </span>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {editingId === cat.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(cat.id)}
                      className="text-green-400 hover:scale-110 transition"
                    >
                      <FiSave />
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingName("");
                      }}
                      className="text-white/50 hover:scale-110 transition"
                    >
                      <FiX />
                    </button>
                  </>
                ) : (
                  <>
                    {/* Toggle Status Button */}
                    <button
                      onClick={() => handleToggleStatus(cat.id, cat.active)}
                      className={`hover:scale-110 transition ${
                        cat.active ? "text-green-400" : "text-yellow-400"
                      }`}
                      title={cat.active ? "Deactivate" : "Activate"}
                    >
                      {cat.active ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(cat.id);
                        setEditingName(cat.name);
                      }}
                      className="text-blue-400 hover:scale-110 transition"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-400 hover:scale-110 transition"
                    >
                      <FiTrash2 />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
