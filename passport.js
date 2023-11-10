import passport from "passport";
import passportGoogleOAuth from "passport-google-oauth20";
import UserModel from "./models/UserModel.js";

// Passport configuration function
export const passportConfig = (passport) => {
	passport.use(
		new passportGoogleOAuth.Strategy(
			{
				clientID: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET_KEY,
				callbackURL: "/auth/google/callback",  
				scope: ["profile", "email"], // Defining the requested Google API scopes
			},
			async function (accessToken, refreshToken, profile, done) {
				const newUser = {
					googleId: profile.id,
					name: profile.displayName,
					email: profile.emails[0].value,
					picture: profile.photos[0].value
				}

				try {
					//finding the user in our database 
					let user = await UserModel.findOne({ googleId: profile.id })

					if (user) {
						//If user present in our database.
						done(null, user)
					} else {
						// if user is not preset in our database saving user data to database.
						
						user = await UserModel.create(newUser)
						done(null, user)
					}
				} catch (err) {
					console.error(err)
				}
			}
		)
	);
}

// Serializing the user to a session
passport.serializeUser((user, done) => {
	done(null, user.id)
})

// Deserializing the user from the session
passport.deserializeUser(async (id, done) => {
	try {

		const user = await UserModel.findOne({_id: id})
		done(null, user)
	} catch (error) {
		console.error(error)
	}
})
