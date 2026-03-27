import Product from "../models/product.model.js";
import { productSchema } from "../validation/product.validation.js";

// 🔹 Create product (admin)
export const createProduct = async (req, res, next) => {
  try {
    const validatedData = productSchema.parse(req.body);

    const product = await Product.create(validatedData);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// 🔹 Get all products (with advanced features)
export const getAllProducts = async (req, res, next) => {
  try {
    let query = Product.find();

    // 🔍 SEARCH
    if (req.query.search) {
      query = query.find({
        name: {
          $regex: req.query.search,
          $options: "i",
        },
      });
    }

    // 📊 FILTER
    if (req.query.category) {
      query = query.find({
        category: {
          $regex: req.query.category,
          $options: "i",
        },
      });
    }

    // ↕️ SORT
    if (req.query.sort) {
      if (req.query.sort === "price") {
        query = query.sort({ price: 1 });
      } else if (req.query.sort === "-price") {
        query = query.sort({ price: -1 });
      } else if (req.query.sort === "name") {
        query = query.sort({ name: 1 });
      } else if (req.query.sort === "-name") {
        query = query.sort({ name: -1 });
      } else {
        query = query.sort(req.query.sort);
      }
    } else {
      query = query.sort({ createdAt: -1 });
    }

    // 📄 PAGINATION
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const products = await query;
    const totalProducts = await Product.countDocuments(query.getFilter());
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      success: true,
      count: products.length,
      totalPages,
      currentPage: page,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// 🔹 Get single product
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// 🔹 Update product
export const updateProduct = async (req, res, next) => {
  try {
    const validatedData = productSchema.partial().parse(req.body);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// 🔹 Delete product
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    next(error);
  }
};
