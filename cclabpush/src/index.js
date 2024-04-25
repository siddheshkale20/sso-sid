const mongoose=require("mongoose")
const express=require("express");
const app= express();
app.set('view engine', 'ejs');
const session=require("express-session")
const passport = require("passport");
app.use(session({secret:"cats"}))
app.use(passport.initialize())
app.use(passport.session());
const auth=require("./auth.js");
var ClickSchema = new mongoose.Schema({fullName:String,lastName:String,email:String,picture:String,googleId:String});
//mongoose.connect("mongodb://localhost:27017/users")
//const Users=mongoose.model("UserData",{firstName:String,lastName:String,password:String,email:String,dob:String,userName:String})
//const User=mongoose.model("SSO_data",ClickSchema)
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
function isLoggedIn(req,res,next){
    req.user ? next() : res.sendStatus(401);
}
app.get('/signup',(req,res)=>{
    res.sendFile(__dirname+'/signup.html');
})
  app.use(express.json())
app.get('/',(req,res)=>{
res.send('<a href="/auth/google">Authentication with Google</a>')
})
app.get('/auth/google',passport.authenticate('google',passport.authenticate('google',{scope:['email','profile']})))
app.get('/google/callback',passport.authenticate('google',{
    successRedirect:'/protected',
    failureRedirect:'/auth/failure'
}))
app.get('auth/failure',(req,res)=>{     res.send("Something went wrong");
})
app.get('/protected',isLoggedIn,(req,res)=>{
    res.sendFile(__dirname+'/learn31.html')
})
app.get('/logout',(req,res,next)=>{
  //  console.log('HOIIIIIIIIIIIIIIII')
    req.session.destroy();
    res.send("LOGGED OUT")
})
app.post("/login",async function(req,res){
    const usernam=req.body.username
    const password=req.body.password
    const exist=await Users.findOne({userName:usernam,password:password})
    if(!exist)
    {
       return res.status(403).send("No User Exist")
    }
    return res.sendFile(__dirname+"/learn31.html")
 })
 app.post("/web",auth)

app.listen(3000,()=>{
    console.log("Listening on port 3000")
})
