const User = require('./User')
const Post = require('./post/Post')
const Comment = require('./post/Comment')
const { Schema, model } = require('mongoose')

const notificationSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reciever: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: String,
      enum: ['like', 'comment', 'reply', 'friendRequest', 'story', 'custom'],
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    source: {
      sourceId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      referance: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true },
)

notificationSchema.pre('save', async function () {
  const user = await User.findOne({ _id: this.sender })
  switch (this.event.toUpperCase()) {
    case 'LIKE':
      this.text = `${user.name} liked your ${this.source.referance}`
      break
    case 'COMMENT':
      this.text = `${user.name} commented on your ${this.source.referance}`
      break
    case 'REPLY':
      this.text = `${user.name} replied to your ${this.source.referance}`
      break
    case 'ADDFRIEND':
      this.text = `${user.name} send you a ${this.source.referance} request`
      break
    case 'STORY':
      this.text = `${user.name} uploaded a ${this.source.referance}`
      break
  }
})

const Notification = new model('Notification', notificationSchema)

module.exports = Notification