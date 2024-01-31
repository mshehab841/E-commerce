const {
  findCategoryByName,
  createCategory,
  updateCategory,
  getAllCategory,
} = require("./category.repo");

module.exports = {
  addCategoryServices: async (name, description) => {
    const category = await findCategoryByName(name);
    if (category) {
      const error = appError.createError(
        "category already exist",
        400,
        httpStatusText.FAIL
      );
      throw error;
    }
    const newCategory = {
      name,
      description,
    };
    await createCategory(newCategory);
  },
  updateCategoryServices: async (categoryId, name, description) => {
    const category = await updateCategory(categoryId, name, description);
    if (!category) {
      const error = appError.createError(
        "category not found",
        400,
        httpStatusText.FAIL
      );
      throw error;
    }
    return category;
  },
  getAllCategoryServices: async () => {
    const categories = await getAllCategory();
    if (!categories) {
      const error = appError.createError(
        "category not found",
        400,
        httpStatusText.FAIL
      );
      throw error;
    }
    return categories;
  },
};
