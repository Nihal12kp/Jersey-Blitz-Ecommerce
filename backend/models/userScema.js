const mongoose = require("mongoose");
const schema =mongoose.Schema;

const userSchema= new schema({
    name: {
        type: String
    },
    email: {
        type:String,
        unique:true
    },
    password:{
        type: String
    },
    cartData:{
        type: Object,
    },
    date:{
        type:Date,
        default:Date.now
    },
    banned: { 
        type: Boolean,
        default: false
      }

});

const User = mongoose.model('User',userSchema);
module.exports=User;