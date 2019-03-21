const express = require("express");
var router = express.Router();

router.use("/admin", require("./admin/admin"));
router.use("/store", require("./store/store"));
router.use("/user", require("./user/users"));

router.use("/signin", require("./signin"));

//router.use("/signup", require("./signup"));
router.use("/images", require("./images"));


module.exports = router;