const passport= require("passport");
const mongoose=require("mongoose")
require('dotenv').config();
const GoogleStrategy=require("passport-google-oauth20").Strategy;
const Google_ClientId=process.env.Google_ClientId
const Google_ClientSecret=process.env.Google_ClientSecret
const mongo_latest=process.env.Mongo_local
var ClickSchema = new mongoose.Schema({fullName:String,lastName:String,email:String,picture:String,googleId:String});
const  callback_url="http://localhost:3000/google/callback";
mongoose.connect(mongo_latest)
const User=mongoose.model("SSO_data",ClickSchema)
passport.use(new GoogleStrategy({
    clientID:Google_ClientId,
    clientSecret:Google_ClientSecret,
    callbackURL:callback_url,
    scope:['email','profile'],
    passReqToCallback:true
    
},async(req,accessToken,refereshToken,profile,cb)=>
{
  //return cb(null,profile);
  console.log("Siddhesh")
    const defaulUser={
        fullName: `${profile.name.givenName} ${profile.name.familyName}`,
        lastName:profile.name.familyName,
        email: profile.emails[0].value,
        picture:profile.photos[0].value,
        googleId:profile.id,
    }
    console.log(profile.id)
    console.log(accessToken)
    const existinguser= await User.findOne({email: profile.emails[0].value})


    if(existinguser){return cb(null,profile)}
    const users=new User({
        fullName: `${profile.name.givenName} ${profile.name.familyName}`,
        lastName:profile.name.familyName,
        email: profile.emails[0].value,
        picture:profile.photos[0].value,
        googleId:profile.id,
     });
     users.save();
    return cb(null,profile)
    /*const user= await User.findOrCreate({where:{email: profile.emails[0].value},defaults:defaulUser}).catch((err)=>{
        console.log("Error signing up",err);
        cb(err,null);
    })

    if(user && user[0])return cb(null,user && user[0]);*/
}))
passport.serializeUser((user,cb)=>{ 
    //creates an cookie token with the help of user id which is coded and allot a session
    console.log("Serializing User: ",user);
    cb(null,user);
});
passport.deserializeUser( function(user,cb){
   /* const users= await User.findOne({where:{email: user.email}}.catch((err)=>{
        console.log("Error deserializing",err);
        cb(err,null)
    }))*/
    //done(null,user)
    console.log("DeSerialized User",user);
    cb(null,user);
})



const auth=async(req,res)=>{
    const lastname=req.body.lastname
    const val=await User.find({lastName:lastname})
    const name=[]
    val.forEach(function(item){
       name.push(item["email"]);
    });
    const data = {
        title: 'Info',
        dataArray: name
    };
    return res.render('final',data);
};

module.exports = auth;