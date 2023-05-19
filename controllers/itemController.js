const Item = require("../models/item");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
    // Get details of items and categories count 
    const [numItems, numCategories] = await Promise.all([
        Item.countDocuments({}).exec(),
        Category.countDocuments({}).exec(),
    ]);

    res.render("index", {
        title: "Inventory App Home Page",
        item_count: numItems,
        category_count: numCategories
    });
});

// Display list of all items
exports.item_list = asyncHandler(async (req, res, next) => {
    const allItems = await Item.find({}, "name price")
        .sort({ name: 1 })
        .exec();
    
  res.render("item_list", {
    title: "Item List",
    item_list: allItems
  });
});

// Display detail page for a specific item
exports.item_detail = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate("category").exec();

    if (item === null) {
        // No results
        const err = new Error("Item not found.");
        err.status = 404;
        return next(err);
    }

    res.render("item_detail", {
        title: item.name,
        item
    });
});


// Display item create form on GET
exports.item_create_get = asyncHandler(async (req, res, next) => {
    // Get all categories, which item can be set into
    const allCategories = await Category.find().exec();

    res.render("item_form", {
        title: "Create Item",
        categories: allCategories
    });
});

// Handle item create form on POST
exports.item_create_post = [
    // Convert the category to an array
    (req, res, next) => {
        if (!(req.body.category instanceof Array)) {
            if (typeof req.body.category === "undefined") req.body.category = [];
            else req.body.category = new Array(req.body.category);
        }
        next();
    },

    // Validate and sanitize fields
    body("name", "Name must not be empty.")
        .trim()
        .isLength({ min: 5 })
        .escape(),
    body("description", "Description must not be empty")
        .trim()
        .isLength({ min: 5 })
        .escape(),
    body("category.*").escape(),
    body("price", "Price must not be empty.")
        .trim()
        .escape(),
    body("numberInStock", "Number in stock must not be empty")
        .trim()
        .escape(),
    
    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create an item object with escaped and trimmed data
        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            numberInStock: req.body.numberInStock
        });

        if (!errors.isEmpty()) {
            // Render form again with sanitized values/errors

            // Get all categories for form
            const allCategories = await Category.find().exec();

            // Mark selected categories as checked
            for (const cat of categories) {
                if (item.category.indexOf(cat._id) > -1) {
                    cat.checked = "true";
                }
            }

            res.render("item_form", {
                title: "Create Item",
                categories: allCategories,
                item,
                errors: errors.array()
            });
        } else {
            // Date form is valid. Save item
            await item.save();
            res.redirect(item.url);
        }
    }),
];

// Display item delete form on GET
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  // Get  requested item
  const item = await Item.findById(req.params.id).exec();

  if (item === null) {
    // No item found
    res.redirect("/catalog/items");
  }

  res.render("item_delete", {
    title: "Delete Item",
    item
  });
});

// Handle item delete on POST
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  const item = await Item.findByIdAndRemove(req.body.itemid);
  res.redirect("/catalog/items");
});

// Display item update form on GET
exports.item_update_get = asyncHandler(async (req, res, next) => {
  // Get item and categories for form
  const [item, allCategories] = await Promise.all([
    Item.findById(req.params.id).populate("category").exec(),
    Category.find().exec()
  ]);

  if (item === null) {
    // No item found
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  // Mark out selected categories as checked
  for (const cat of allCategories) {
    for (const item_cat of item.category) {
      if (cat._id.toString() === item_cat._id.toString()) {
        cat.checked = "true";
      }
    }
  }
  res.render("item_form", {
    title: "Update Item",
    item,
    categories: allCategories
  });
});

// Handle item update on POST
exports.item_update_post = [
  // Convert the category to an array
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === "undefined") {
        req.body.category = [];
      } else {
        req.body.category = new Array(req.body.category);
      }
    }
    next();
  },
  // Validate and sanitize fields
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("category.*").escape(),
  body("price", "Price must not be empty.")
    .trim()
    .escape(),
  body("numberInStock", "Number in stock must not be empty")
    .trim()
    .escape(),
    
  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create an item object with escaped and trimmed data
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      numberInStock: req.body.numberInStock
    });

    if (!errors.isEmpty()) {
      // Render form again with sanitized values/errors

      // Get all categories for form
      const allCategories = await Category.find().exec();

      // Mark selected categories as checked
      for (const cat of categories) {
        if (item.category.indexOf(cat._id) > -1) {
          cat.checked = "true";
        }
      }

      res.render("item_form", {
        title: "Create Item",
        categories: allCategories,
        item,
        errors: errors.array()
      });
    } else {
      // Date form is valid. Save item
      await item.save();
      res.redirect(item.url);
    }
  }),
];



