import express from "express";
import {register, login, getProfile} from '../controllers/Authentication.js'
import passport from 'passport';

//Middleware to very token and add user id to the req object if the user is valid
import verifyToken from "../middleware/tokenVerify.js";
const router = express.Router();


router.post("/signup", register); // api for manual regsitration
router.post("/signin", login)  // api for manual login
router.get("/me", verifyToken, getProfile)   // api for getting profile after token verification through middleware

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

// Google login APIS
router.get("/google", passport.authenticate('google', ["profile", "email"]));

router.get(
	"/google/callback",
	passport.authenticate('google', {
		successRedirect: 'http://localhost:3000',
		failureRedirect: "/login/failed",
	})
);
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect('http://localhost:3000');
});

export default router;