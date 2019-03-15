const express = require("express");
var router = express.Router();

router.use("/user", require("./users"));
router.use("/admin", require("./admin"));
router.use("/signin", require("./signin"));
router.use("/signup", require("./signup"));
router.use("/images", require("./images"));


module.exports = router;