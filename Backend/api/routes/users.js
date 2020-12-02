const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middleware/authentication-check");

const UserController = require("../controllers/user");

router.get("/", UserController.user_get_all);

// router.post("/nearby", UserController.users_get_users_nearby);

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.get("/:id", checkAuth, UserController.user_get_user);

router.patch("/:id", checkAuth, UserController.user_update);

router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;
