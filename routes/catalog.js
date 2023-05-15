const express = require("express");
const router = express.Router();

const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");

// ITEM ROUTES ///

// GET catalog home page
router.get("/", item_controller.index);

// GET request for creating new item
router.get("/item/new", item_controller.item_create_get);

// POST request for creating new item
router.post("/item/new", item_controller.item_create_post);

// GET request to delete item
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete item
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update item
router.get("/item/:id/update", item_controller.item_update_get);

// POST request to update item
router.post("/item/:id/update", item_controller.item_update_post);

// GET request for single item
router.get("/item/:id", item_controller.item_detail);

// GET request for lis of all items
router.get("/items", item_controller.items_list);


// CATEGORY ROUTES ///

// GET request for creating new category
router.get("/category/new", category_controller.category_create_get);

// POST request for creating new category
router.post("/category/new", category_controller.category_create_post);

// GET request to delete category
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete category
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update category
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update category
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for single category
router.get("/category/:id", category_controller.category_detail);

// GET request for lis of all items
router.get("/categories", category_controller.categories_list);

module.exports = router;
