import mongoose, { Schema, models, model } from 'mongoose'

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

const defaultUserPermissions = () => {
  return {
    maxPolls: 5
  }
}

const userSchema = new Schema({
  replitId: String,
  username: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    default: "DEFAULT"
  },
  permissions: {
    type: {
      maxPolls: Number,
    },
    default: defaultUserPermissions
  }
})

export const User = models.User || model("User", userSchema)

const voteSchema = new Schema({
  index: Number,
  uid: String,
  date: {
    type: Date,
    default: Date.now
  }
})
const pollSchema = new Schema({
    title: String,
    official: Boolean,
    votes: {
      type: [voteSchema],
      default: []
    },
    voteCount: {
      type: Number,
      default: 0
    },
    options: [ String ],
    createdBy: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
})

export const Poll = models.Poll || model("Poll", pollSchema)