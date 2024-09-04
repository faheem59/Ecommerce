"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.post('/register', userController_1.register);
router.post('/login', userController_1.login);
router.post('/logout', userController_1.logout);
router.get('/users/:userId', userController_1.getUserById);
router.get('/user/:id', userController_1.getUserByIds);
exports.default = router;
