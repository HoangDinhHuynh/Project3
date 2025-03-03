const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products:[
        {
            product :{type:mongoose.Types.ObjectId,ref:'Product'},
            quantity:Number,
            color:String,
            price : Number,
            thumbnail : String,
            tiltle : String
        }
    ],
    status:{
        type:String,
        default:'Cancelled',
        emun :['Cancelled','Succeed']
    },
    total:Number,
    
    orderBy:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
},{
    timestamps : true
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);