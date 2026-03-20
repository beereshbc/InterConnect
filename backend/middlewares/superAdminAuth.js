import jwt from "jsonwebtoken";

const superAdminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Super Admin Access Denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Super Admin privileges required.",
      });
    }

    req.superAdminId = decoded.id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Super Admin session expired. Please log in again.",
      });
    }
    res
      .status(401)
      .json({ success: false, message: "Invalid super admin token." });
  }
};

export default superAdminAuth;
