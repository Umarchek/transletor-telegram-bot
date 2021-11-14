const Schema = require('mongoose').Schema
const client = require('./mongo')

const UserSchema = new Schema({
    chat_id: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    text: {
        type: String,
        trim: true,
        maxlength: 1024
    }
})

async function UserModel() {
    let db = await client()
    return await db.model('users', UserSchema)
}

async function findUser(chat_id) {
    let db = await UserModel()
    return await db.findOne({ chat_id: chat_id })
}

async function createUser(chat_id) {
    let db = await UserModel()
    return await db.create({ chat_id })
}

async function setText(chat_id, text) {
    let db = await UserModel()
    return await db.updateOne({ chat_id }, { text })
}

module.exports = {
    findUser,
    createUser,
    setText
}