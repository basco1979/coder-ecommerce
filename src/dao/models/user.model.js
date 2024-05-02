import mongoose from "mongoose";

const userCollection = 'users';

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cartId: {
        type: mongoose.Types.ObjectId,
        ref: 'Cart'
    },
    role: {
        type: String,
        default: 'user'
    },
    documents:{
        type: [
            {
                name: String,
                reference : String,
                doctype: String
            }
        ],
        default: []
    },
    last_connection:{
        type: Date
    }

});

export const userModel = mongoose.model(userCollection, userSchema);