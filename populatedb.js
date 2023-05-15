#! /usr/bin/env node

console.log(
    'This script populates some test items and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
    await createCategories();
    await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(name, description) {
    const category = new Category({
        name: name,
        description: description
    });
    await category.save();
    categories.push(category);
    console.log(`Added category: ${name}`);
}

async function itemCreate(name, description, category, price, numberInStock) {
    const item = new Item({
        name: name,
        description: description,
        category: category,
        price: price,
        numberInStock: numberInStock
    });
    await item.save();
    items.push(item);
    console.log(`Added item: ${name}`);
}

async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
        categoryCreate("Toy","Paper, wooden, rubber and plush toys."),
        categoryCreate("Blanket", "Specially designed blankets for a full cat experience."),
        categoryCreate("Scratching post", "Cardboard, wooden and rope ones, horizontal and vertical.")
    ]);
}

async function createItems() {
    console.log("Adding items");
    await Promise.all([
        itemCreate("Gray mouse", "Little gray mouse is must have for every cat household.", categories[0],
            0.75, 20),
        itemCreate("White mouse", "For a sofisticated cats.", categories[0], 1, 20),
        itemCreate("Blue blanket", "Fluffiest blanket for sweetest dreams and longest purrs.", categories[1], 15, 10),
        itemCreate("Heated blanket", "For those extra cold days. Almost to none energy consumption", categories[1], 75, 5),
        itemCreate("Wave", "Wave shaped cardboard horizontal scratching post. Excellent for beggineres", categories[2],
            5, 50),
        itemCreate("Small castle", "Only the best for their highness. With 4 levels and 5 vertical scratching posts, your cats will surely enjoy every piece of it",
            categories[2], 250, 10),
    ]);
}
