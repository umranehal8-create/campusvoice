function adminMiddleware(req, res, next) {
    console.log("req.user=:??",req.user)
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "acess denies , admins only",
    });
  }
  next();
}
module.exports = adminMiddleware;

