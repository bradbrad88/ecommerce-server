const router = require("express").Router();
const { Category, Product } = require("../../models");

router.get("/", async (req, res, next) => {
  try {
    const data = (await Category.findAll({ include: Product })) || [];
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Category.findByPk(id, { include: Product });
    if (!item) return res.sendStatus(400);
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { category_name } = req.body;
    const newCategory = await Category.create({ category_name });
    res.json(newCategory);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = await Category.update(req.body, { where: { id } });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Category.destroy({ where: { id } });
    if (result !== 1) return res.sendStatus(400);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
