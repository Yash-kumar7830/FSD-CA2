const express = require("express");
const Book = require("../Schema/Book");

const router = express.Router();

router.post("/", async (req, res) => {
  const { title, author, category } = req.body || {};

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  const book = await Book.create({ title, author, category });
  return res.status(201).json({ message: "Book created", book });
});

router.get("/", async (req, res) => {
  const page = getPageNumber(req.query.page, 1);
  const limit = getPageNumber(req.query.limit, 10);

  if (!page || !limit) {
    return res
      .status(400)
      .json({ message: "Page and limit must be positive whole numbers" });
  }

  if (limit > 100) {
    return res.status(400).json({ message: "Limit cannot exceed 100" });
  }

  const [books, totalRecords] = await Promise.all([
    Book.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Book.countDocuments(),
  ]);

  return res.status(200).json({
    books,
    page,
    limit,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
  });
});

router.patch("/:id", async (req, res) => {
  const { availability } = req.body || {};

  if (typeof availability !== "boolean") {
    return res
      .status(400)
      .json({ message: "Availability must be true or false" });
  }

  const book = await Book.findByIdAndUpdate(
    req.params.id,
    { availability },
    { new: true, runValidators: true }
  );

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json({ message: "Book availability updated", book });
});

function getPageNumber(value, defaultValue) {
  if (value === undefined) {
    return defaultValue;
  }

  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : null;
}

module.exports = router;
