import mongoose, { Schema, models, model } from 'mongoose'

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

const userSchema = new Schema({
  replitId: String,
  username: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  role: String
})

export const User = models.User || model("User", userSchema)

const pollSchema = new Schema({
    title: String,
    official: Boolean,
    votes: {
      type: Array,
      default: []
    },
    options: [ String ],
    createdBy: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
})

export const Poll = models.Poll || model("Poll", pollSchema)