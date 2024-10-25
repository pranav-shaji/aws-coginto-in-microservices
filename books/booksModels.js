const mongoose = require("mongoose")

booksSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    pages:{
        type:Number,
        required:true

    },
    price:{
        type:Number,
        required:true
    }
        

},{timestamps:true})
module.exports = mongoose.model("books",booksSchema);