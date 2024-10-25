const jwt =require("jsonwebtoken")
const validate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("Authorization Header:", authHeader); // Log authorization header
    
    if (!authHeader) {
      return res.status(403).json({ message: "No token provided" });
    }
    
    const token = authHeader.split(' ')[1];
    console.log("Token:", token); // Log token for debugging
    
    if (!token) {
      return res.status(403).json({ message: "Token format invalid" });
    }
  
    try {
      const decoded = jwt.verify(token, "123");
      req.user = decoded;
      next();
    } catch (error) {
      console.error("JWT Error:", error); // Log error for debugging
      return res.status(401).json({ message: "Invalid token" });
    }
  };

  module.exports = validate
  