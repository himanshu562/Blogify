const {Schema,model}= require("mongoose");
const blogSchema= new Schema({
    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    coverImageURL:{
        type:String,
        required:false,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"user",   // reference//
    },
},
{timestamps:true}
);
// creating a new module//
const Blog= model("blog",blogSchema);

module.exports=Blog;