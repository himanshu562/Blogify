  const path=require("path");
  const express=require("express");
  const mongoose=require("mongoose")
  const userRoute=require('./routes/user')
  const blogRoute=require('./routes/blog')

// getting all the blogs//
  const cookieParser=require('cookie-parser');
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
// getting all the blogs//

const Blog=require("./models/blog")

console.log("My name is",process.env.myname);
  const app=express();
  const PORT=8000; 

 /* // for deploy on aws we need to do some changes//
  const app=express();
  const PORT=process.env.PORT || 8000;  // making an environment port// enviroment variables are dynamic variables//
*/
  mongoose.connect('mongodb://localhost:27017/blogify')
  .then(e=>console.log('MongoDb Connected'))
  app.set('view engine','ejs');
  app.set("views",path.resolve("./views"));
 
app.use(express.urlencoded({extended:false}));//  using middleware  otherwise it will show body is not defined//
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')))
app.use(express.static(path.resolve('./public')))

  app.get('/', async(req,res)=>{
    const allBlogs=await Blog.find({});  //finding blogs
    res.render ("home", {
      user:req.user,
      blogs:allBlogs, // use card to render correctly//
    }); 
  })

  app.use('/user',userRoute)
  app.use('/blog',blogRoute)

  
 
  app.listen(PORT,()=>console.log(`Server Started at PORT:${PORT}`));
