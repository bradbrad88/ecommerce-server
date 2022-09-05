const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

// Find all tags
router.get("/", async (req, res, next) => {
  try {
    const tags = await Tag.findAll({ include: [{ model: Product, as: "products" }] });
    res.json(tags);
  } catch (error) {
    next(error);
  }
});

// Find a single tag by its `id`
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByPk(id, { include: { model: Product, as: "products" } });
    // Return 'bad request' if tag does not exist
    if (!tag) return res.sendStatus(400);
    res.json(tag);
  } catch (error) {
    next(error);
  }
});

// Create a new tag
router.post("/", async (req, res, next) => {
  try {
    const newTag = await Tag.create(req.body);
    res.json(newTag);
  } catch (error) {
    next(error);
  }
});

// Update a tag's name by its `id` value
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Tag.update(req.body, { where: { id } });
    if (result[0] < 1) return res.sendStatus(400);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

// Delete on tag by its `id` value
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Tag.destroy({ where: { id } });
    if (result < 1) return res.sendStatus(400);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
