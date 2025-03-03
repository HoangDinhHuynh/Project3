const mongoose = require('mongoose'); // Erase if already required
const brcrypt = require('bcrypt')
const crypto = require('crypto')

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
    },
    mobile:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum: [2000,1000],
        default:1000,
    },
    cart:[{
        product :{type:mongoose.Types.ObjectId,ref:'Product'},
        quantity:Number,
        color:String,
        price : Number,
        thumbnail : String,
        tiltle : String
    }],
    address:String,
    wishlist:[{type:mongoose.Types.ObjectId, ref: 'Product'}],
    isBlocked:{
        type: Boolean,
        default: false
    },
    refreshToken:{
        type: String,
    },
    passwordChangedAt:{
        type: String
    },
    passwordResetToken:{
        type: String
    },
    passwordResetExpires:{
        type: String
    },
    registerToken:{
        type: String
    },
},{
    timestamps:true
});


// BĂM MẬT KHẨU 
userSchema.pre('save', async function(next){
    if (!this.isModified('password')){
        next()
    }
    const salt = brcrypt.genSaltSync(10)
    this.password = await brcrypt.hash(this.password,salt)
})


// CHECK MẬT KHẨU ĐÃ BĂM  
userSchema.methods = {
    isCorrectPassword: async function (password) {
        return await brcrypt.compare(password, this.password)
    },
    createPasswordChangedToken: function(){
        const resetToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordResetExpires = Date.now() + 15*60*1000
        return resetToken
    }
}

// 

//Export the model
module.exports = mongoose.model('User', userSchema);