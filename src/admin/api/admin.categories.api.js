import api from "../../api/axios";

/* =========================================
   ADMIN CATEGORIES API
   Backend: AdminCategoryController
   ========================================= */

/**
 * GET all categories (Admin)
 * GET /api/admin/categories
 */
export const getAllCategories = () => {
  return api.get("/api/admin/categories");
};

/**
 * CREATE category
 * POST /api/admin/categories
 * body: { name: "Birthday" }
 */
export const createCategory = (data) => {
  return api.post("/api/admin/categories", data);
};

/**
 * UPDATE category
 * PUT /api/admin/categories/{id}
 * body: { name: "Updated Name" }
 */
export const updateCategory = (id, data) => {
  return api.put(`/api/admin/categories/${id}`, data);
};

/**
 * DELETE category
 * DELETE /api/admin/categories/{id}
 */
export const deleteCategory = (id) => {
  return api.delete(`/api/admin/categories/${id}`);
};

/**
 * TOGGLE category status (activate/deactivate)
 * PATCH /api/admin/categories/{id}/status
 * query: ?active=true|false
 */
export const toggleCategoryStatus = (id, active) => {
  console.log(`[CATEGORY] Starting toggle for category ${id}, setting active to ${active}`);
  console.log(`[CATEGORY] Request URL: /api/admin/categories/${id}/status?active=${active}`);
  
  return api.patch(`/api/admin/categories/${id}/status`, {}, {
    params: { active }
  })
  .then(res => {
    console.log(`[CATEGORY] ✅ Toggle success:`, res.data);
    return res;
  })
  .catch(err => {
    console.error(`[CATEGORY] ❌ Toggle failed`);
    console.error(`[CATEGORY] Error status:`, err.response?.status);
    console.error(`[CATEGORY] Error data:`, err.response?.data);
    console.error(`[CATEGORY] Error message:`, err.message);
    console.error(`[CATEGORY] Full error:`, err);
    throw err;
  });
};
