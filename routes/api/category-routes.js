const router = require("express").Router();
const { Category, Product } = require("../../models");

// Get all categories
router.get("/", async (req, res, next) => {
  try {
    const data = (await Category.findAll({ include: Product })) || [];
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Get a category by its ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    // Include Product data associated with the Tag
    const item = await Category.findByPk(id, { include: Product });
    if (!item) return res.sendStatus(400);
    res.json(item);
  } catch (error) {
    next(error);
  }
});

// Create a new category
router.post("/", async (req, res, next) => {
  try {
    const { category_name } = req.body;
    const newCategory = await Category.create({ category_name });
    res.json(newCategory);
  } catch (error) {
    next(error);
  }
});

// Update a category
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = await Category.update(req.body, { where: { id } });
    // If no change was made return 'bad request'
    if (update[0] !== 1) return res.sendStatus(400);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

// Delete a category
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Category.destroy({ where: { id } });
    // If query didn't affect any rows then return 'bad request'
    if (result !== 1) return res.sendStatus(400);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
