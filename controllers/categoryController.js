const Category = require("../models/category");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all categories
exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}, "name description")
        .sort({ name: 1 })
        .exec();
    
    res.render("category_list", {
        title: "Category List",
        category_list: allCategories
    });
});

// Display detail for a specific category
exports.category_detail = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec();

    if (category === null) {
        // No results
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }

    res.render("category_detail", {
        title: category.name,
        category
    });
});

// Display create form on GET
exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.render("category_form", {
        title: "Create Category"
    });
});

// Handle create form on POST
exports.category_create_post = [
    // Validate and sanitize the fields
    body("name", "Name must not be empty.")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("description", "Description must not be empty.")
        .trim()
        .isLength({ min: 10 })
        .escape(),
    
    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create a category object with escaped and trimmed data
        const category = new Category({
            name: req.body.name,
            description: req.body.description
        });

        if (!errors.isEmpty()) {
            // Render form again with sanitized values/errors
            res.render("category_form", {
                title: "Create Category",
                category
            });
        } else {
            // Data is valid, save category
            await category.save();
            res.redirect(category.url);
        }
    }),
];

// Display category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    // Get category
    const category = await Category.findById(req.params.id).exec();

    if (category === null) {
        // No category found
        res.redirect("/catalog/categories");
    }

    res.render("category_delete", {
        title: "Delete Category",
        category
    });
});

// Handle category delete on POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    const category = await Category.findByIdAndRemove(req.body.categoryid);
    res.redirect("/catalog/categories");
});

// Display category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
    // Get category
    const category = await Category.findById(req.params.id).exec();

    if (category === null) {
        // No item found
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }

    res.render("category_form", {
        title: "Update Category",
        category
    });
});

// Handle category update on POST
exports.category_update_post = [
    // Validate and sanitize the fields
    body("name", "Name must not be empty.")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("description", "Description must not be empty.")
        .trim()
        .isLength({ min: 10 })
        .escape(),
    
    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create a category object with escaped and trimmed data and old id
        const category = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            // Render form again with sanitized values/errors
            res.render("category_form", {
                title: "Create Category",
                category
            });
        } else {
            // Data is valid, update category
            const theCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
            res.redirect(category.url);
        }
    }),
];