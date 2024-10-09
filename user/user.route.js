import express from 'express';
import * as userController from './user.controller.js';

const router = express.Router();

// Create a new user
router.post('/user', userController.createUser);

export default router;