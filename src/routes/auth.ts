import { Router } from "express";
import { signup, login, me } from "../controllers/auth";
import { errorHandler } from "../error-handler";
import { authMiddleware } from "../middlewares/auth";

const authRouter: Router = Router();

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Create a new user account
 *     description: This endpoint allows a new user to create an account.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Pass123!
 *     responses:
 *       201:
 *         description: User successfully created
 *       400:
 *         description: Invalid input or email already exists
 */
authRouter.post("/signup", errorHandler(signup));

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Log in an existing user with email and password.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Pass123!
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
authRouter.post("/login", errorHandler(login));

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get the logged-in user's details
 *     description: This endpoint retrieves the current user's details if authenticated.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *       401:
 *         description: Unauthorized, invalid or missing token
 */
authRouter.get("/me", [authMiddleware], errorHandler(me));

export default authRouter;
