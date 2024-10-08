const {createHmac,randomBytes} = require('node:crypto');
const {Schema,model}= require("mongoose");
const {createTokenForUser}=require('../services/authentication')
const userSchema= new Schema(
    {
        fullName:{
            type:String,
           
           
        },
        email:{
            type:String,
            unique:true,
            required:true,
        },
        salt:{
            type:String,
            
        },
        password:{
         type:String,
         required:true,
        },
        ProfileImageUrl:{
            type:String,
            default:"./images/blog.png",
        },
        role:{
            type:String,
            enum:["USER","ADMIN"],
            default:"USER",
        },
    },
    {timestamps:true}

);
userSchema.pre("save",function(next){
    const user=this; // this is denoting the user//
    if(!user.isModified("password")) return;

    const salt= randomBytes(16).toString();// secret convert it into string.//
    const hashedPassword=createHmac("sha256",salt)   // "sha256" is algo used to create a password
      .update(user.password)
      .digest("hex");

      this.salt=salt;
      this.password=hashedPassword;
      next();
})
// creating a virtual function which provide user email and password during the sigin//
userSchema.static("matchPasswordAndGenerateToken",async function(email,password){
    const user= await this.findOne({email}); // search by email
    if(!user) 
    throw new Error("User Not found!");
    const salt=user.salt; // accessing user password and tried to match with provided password afetr searching//
    const hashedPassword=user.password;

    const userProvidedHash=createHmac("sha256",salt) // update means matching provided password and user password//
    .update(password)
    .digest("hex");
     
    if(userProvidedHash!==hashedPassword) throw new Error("Incorrect Password");  // it will be the good practice beacuse it hide the password and not to hack//
// if we insert wrong password during sigin it will show "Incorrect Password"
// if we insert correct password during signin it will matche and directing to the homapage(as per code)//
    
      const token = createTokenForUser(user);
      return token;
// return user;// now it will return the detail of user like email , password and fullname and other detail(created at ,updated at, etc)// //else//   // return(userProvidedHash===hashedPassword)
});      // if user credential are matched then we can return token instead of return user
// after tha t we will recieve a token and if we paste that token on the jwt.io site then it will show all credential taken in the payload.


const User=model('user',userSchema);
module.exports=User;
