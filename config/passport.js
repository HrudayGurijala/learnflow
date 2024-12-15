const passport=require('passport');
const mongoose=require('mongoose');
const GoogleApproach=require('passport-google-oauth20').Strategy;
const User=mongoose.model('users');

const callbackURL = process.env.NODE_ENV === 'production' ? 
    'https://learnify-n5gh.onrender.com/auth/google/callback' : 
    'http://localhost:3000/auth/google/callback';

passport.use(
    new GoogleApproach({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:callbackURL
         //accessToken -> temperaroy access to google calender etc
    },async (accessToken,refreshToken,profile,done)=>{
        console.log('Access Token:', accessToken);
        console.log('Profile:', profile);
        const newUser={
            googleID:profile.id,
            firstName:profile.name.givenName,
            lastName:profile.name.familyName,
            displayName:profile.displayName,
            email:profile.emails[0].value,
            image:profile.photos[0].value

        };
        try {
            let user=await User.findOne({email:newUser.email});
            if(user){
                // User Exists
                console.log('EXISTS user',user);
                done(null,user);
            } else{
                 // Sign Up for the first time
                 user=await  User.create(newUser);
                console.log('New user',user);
                done(null,user);
            }
        } catch (error) {
            console.log(error);
            done(error);
        }
    })
);
//After user successfully login ,passport makes a call to serialize user function internally and it makes use of id property of the user

//makes an session in db with user id and creates a cokkie for that session id
passport.serializeUser((user,done)=>{
    done(null,user.id);
});

//further requst user makes a call to this function if a session with that user id exits then we process sebsequent request
passport.deserializeUser(async (id,done)=>{
    try {
        const user=await User.findById(id);
        done(null,user);
    } catch (error) {
        done(error);
    }
})