const {Router}=require("express");
const multer =require("multer");
const path= require ("path");
const Blog=require('../models/blog') // importing blog from models
const Comment=require('../models/comment');

const router=Router();
// copying diskstorage from multer sites
// The disk storage engine gives you full control on storing files to disk.
const storage = multer.diskStorage({
    destination: function (req, file, cb) { // destination means kaha pe store krna hai
      cb(null, path.resolve(`./public/uploads/`));// har user ka apna ek folder hoga//
    },
    filename: function (req, file, cb) {  // file name kaisa hoga//
        const fileName=`${Date.now()}-${file.originalname}`; // we are storing the filename//
        cb(null,fileName);// cb is call back
      
    }
  })
  const upload = multer({storage:storage})// store in the storage//

router.get("/add-new",(req,res)=>{
    return res.render("addBlog",{
        user:req.user,// req by user for add new blog//
    })
})
// router for getting to the blog on clicking view//
router.get("/:id",async(req,res)=>{
  const blog=await Blog.findById(req.params.id).populate("createdBy");
  // fetching the comments//
  const comments= await Comment.find({blogId:req.params.id}).populate("createdBy");
  console.log("comments",comments)
  /* 
  now it is showing in terminal 
  createdBy: {
    _id: new ObjectId('6679e72e647f6e3460c9693b'),
    fullName: 'Himanshu Tiwari',
    email: 'harsh1@gmail.com',
    password: '430ec28cf89dfa8c07559711f238420e9ae4fa43c4b5e4a8382f3c9585c6a2f6',
    ProfileImageUrl: './images/blog.png',
    role: 'USER',
    createdAt: 2024-06-24T21:37:50.522Z,
    updatedAt: 2024-06-24T21:37:50.522Z,
    salt: '\x1A�s\x1FqTs�D�%\x15���',
    __v: 0
  },
  createdAt: 2024-07-15T11:09:53.199Z,
  updatedAt: 2024-07-15T11:09:53.199Z,
  __v: 0*/

  /*_id: new ObjectId('66964e93efab4722dda500a0'),
  content: 'Nice one',
  blogId: new ObjectId('66950381a3cb2694f6f27be7'),
  createdBy: {
    _id: new ObjectId('6679e72e647f6e3460c9693b'),
    fullName: 'Himanshu Tiwari',
    email: 'harsh1@gmail.com',
    password: '430ec28cf89dfa8c07559711f238420e9ae4fa43c4b5e4a8382f3c9585c6a2f6',
    ProfileImageUrl: './images/blog.png',
    role: 'USER',
    createdAt: 2024-06-24T21:37:50.522Z,
    updatedAt: 2024-06-24T21:37:50.522Z,
    salt: '\x1A�s\x1FqTs�D�%\x15���',
    __v: 0
  },
  createdAt: 2024-07-16T10:42:27.234Z,
  updatedAt: 2024-07-16T10:42:27.234Z,
  __v: 0
}
]*/
  return res.render('blog',{
    user:req.user,
    blog,
    comments,
  });
})

// creating routes for comment//
router.post("/comment/:blogId",async(req,res)=>{
  await Comment.create({   // creating  the comment section here
    content:req.body.content,   
    blogId:req.params.blogId,
    createdBy:req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`); //redirect to the  user_id//

});


router.post("/",upload.single("coverImage"),async(req,res)=>{
    const {title,body}=req.body
      const blog= await Blog.create({
        title,
        body,
        createdBy : req.user._id,
        coverImageURL: `/uploads/${req.file.filename}` // we are uploading the image in uploads inside the public directory//
      })
      return res.redirect(`/blog/${blog._id}`);
    })

module.exports=router;