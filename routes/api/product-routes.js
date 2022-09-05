const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// Get all products
router.get("/", async (req, res, next) => {
  try {
    const data = await Product.findAll({
      // Include Tag and Category data associated with each product
      include: [
        { model: Tag, as: "tags" },
        { model: Category, as: "category" },
      ],
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Get one product
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        { model: Tag, as: "tags" },
        { model: Category, as: "category" },
      ],
    });
    // Send 'bad request' if product does not exist
    if (!product) return res.sendStatus(400);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Create new product
router.post("/", async (req, res, next) => {
  try {
    // Use object in req.body to create new product
    const product = await Product.create(req.body);
    if (req.body.tagIds.length) {
      // Create an array of ProductTags using the newly created product id
      const productTagIdArr = req.body.tagIds.map(tag_id => ({
        product_id: product.id,
        tag_id,
      }));
      // Add to ProductTag table to link tags to product
      const res = await ProductTag.bulkCreate(productTagIdArr);
    }
    // Return newly created product to the user
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// update product
router.put("/:id", async (req, res, next) => {
  try {
    // Id for the product to be updated
    const { id } = req.params;
    // Update all Products with id:
    const result = await Product.update(req.body, { where: { id } });

    // Get tag_ids from request body, initialise empty array if not provided
    const newTags = req.body.tagIds;

    if (newTags) {
      // Find all ProductTags related to this product:
      const productTags = await ProductTag.findAll({ where: { product_id: id } });

      // Transform the array to an array of ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);

      // Create an array of the new tags that need to be created in ProductTags
      const newProductTags = req.body.tagIds
        // Filter out tags that already exist on the product
        .filter(tag_id => !productTagIds.includes(tag_id))
        // Transform them to objects that include the product ID so new rows can be created on ProductTag
        .map(tag_id => ({
          product_id: id,
          tag_id,
        }));

      // Create array of product_tag ids to delete
      const productTagsToRemove = productTags
        .filter(productTag => !newTags.includes(productTag.tag_id))
        .map(productTag => productTag.id);

      // Perform queries
      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
      return res.sendStatus(200);
    }

    // Test whether changes were made to the product, if not return bad request
    if (result[0] !== 1) return res.sendStatus(400);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// delete product
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    // Remove the product with id provided in params
    const result = await Product.destroy({ where: { id } });
    if (result !== 1) return res.sendStatus(400);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
