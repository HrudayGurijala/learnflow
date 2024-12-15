const passport=require('passport');
const mongoose=require('mongoose');
const GoogleApproach=require('passport-google-oauth20').Strategy;
const User=mongoose.model('users');

const callbackURL = process.env.NODE_ENV === 'production' ? 
    'https://learnflow-ibb1.onrender.com/auth/google/callback' : 
    'https://localhost:10000/auth/google/callback';

passport.use(
    new GoogleApproach({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:callbackURL
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
                console.log('EXISTS user',user);
                done(null,user);
            } else{
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

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser(async (id,done)=>{
    try {
        const user=await User.findById(id);
        done(null,user);
    } catch (error) {
        done(error);
    }
})