import mongoose, { Schema, models, model } from 'mongoose'

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

const userSchema = new Schema({
  replitId: String,
  username: String,
  image: String,
  createdAt: Date,
  role: String
})

export const User = models.User || model("User", userSchema)

const pollSchema = new Schema({
    title: String,
    official: Boolean,
    votes: [{ uid: String, date: String, pick: String }],
    options: [ String ],
    createdAt: Date
})

export const Poll = models.Poll || model("Poll", pollSchema)