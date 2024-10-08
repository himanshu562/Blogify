const {Router}=require("express");
const User=require('../models/user')
const router=Router();
router.get('/signin',(req,res)=>{
    return res.render("signin")
})
router.get('/signup',(req,res)=>{
    return res.render("signup")
})
/*router.post("/signin",async(req,res)=>{
    const{email,password}=req.body  // for signin we only need email and password , during signin we need to find user by email and use salt of email to matched hashes of both email and password.
     const token= await User.matchPasswordAndGenerateToken(email,password); // here we can show with try and catch method //
     // try used with for if both matched and the catch will show the error//
}) */

router.post("/signin",async(req,res)=>{
    const {email , password}=req.body;
    try{
        const token= await User.matchPasswordAndGenerateToken(email,password);
        return res.cookie("token",token).redirect("/");
    }
    catch(error){
        return res.render("signin",{
            error:"Incorrect Email or Password",
        });
    }
});
router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/");
})
 


     
     //if matched
     //console.log("token",token);  //
    //  return res.redirect("/"); 
    // return res.cookie("token",token).redirect("/");   // now we don't return token we create a cookie named 'token' return cookie(direct to homepage)


         // for that create  a virtual function(search mongoose virtual)
router.post('/signup',async(req,res)=>{
    const {fullName,email,password}=req.body;
    await User.create({
        fullName,
        email,
        password,
    })
    
    return res.redirect("/")
})

module.exports=router;