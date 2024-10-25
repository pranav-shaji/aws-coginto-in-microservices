const mongoose = require('mongoose');


// Function to calculate return date, 5 days from the borrowed date
const calculateReturnDate = () => {
    const borrowedDate = new Date();  // Use current date as borrowed date
    return new Date(borrowedDate.getTime() + 5 * 24 * 60 * 60 * 1000);  // Add 5 days
  };

const orderSchema= mongoose.Schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Customer',
        required:true
    },
    bookId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Book',
        required:true

    },
    borrowedDate:{
        type:Date,
        default:Date.now,
        required:true
    },
    returnDate:{
        type:Date,
        default:calculateReturnDate,
        required:true
    }
    
})

module.exports =mongoose.model("orders",orderSchema)