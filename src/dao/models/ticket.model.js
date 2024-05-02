import mongoose from 'mongoose'
const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({
    code : {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime : {
        type:String,
        required: true
        },
    amount : {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required : true,
    }
},
{
    timestamps: true
})

export const ticketModel = mongoose.model(ticketCollection, ticketSchema)