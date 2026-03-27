import User from "../models/userModel.js";
import Product from "../models/product.model.js";

const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments();

    const blockedUsers = await User.countDocuments({
      isBlocked: true,
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        blockedUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getDashboardStats;
