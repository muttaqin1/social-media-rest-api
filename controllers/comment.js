const Comment = require('../models/Comment')
const Post = require('../models/Post')


const createComment = async(req, res, next)=> {
  const {
    postId
  } = req.params
  const comment = new Comment({
    body: req.body.body,
    user: req.user._id,
    postId,
  })

  try {
    const userComment = await comment.save()
    await Post.updateOne({
      _id: postId
    }, {
      $push: {
        'comments': userComment._id
      }
    })
    res.status(200).json({
      success: true,
      userComment
    })
  } catch (e) {
    next(e)
  }
}

const editComment = async (req, res, next)=> {
  const {
    commentId
  } = req.params
  const user = req.user._id
  console.log(req.body)
  console.log(req.user)
  try {
    const comment = await Comment.findOne({
      _id: commentId, user
    })
    if (comment) {
      await Comment.updateOne({
        _id: commentId
      }, {
        $set: {
          body: req.body.body
        }
      })

    } else {
      throw new Error('only the creator can edit his comment')
    }
    res.status(200).json({
      success: true
    })
  } catch (e) {
    next(e)
  }


}

const deleteComment = async (req, res, next)=> {
  const {
    commentId
  } = req.params

  try {
    await Comment.deleteOne({
      _id: commentId, user: req.user._id
    })
    res.status(200).json({
      success: true
    })
  } catch (e) {
    next(e)
  }

}

const like = async (req, res, next)=> {

  try {
    const {
      commentId
    } = req.params
    const user = req.user._id
    const comment = await Comment.findOne({
      _id: commentId
    })

    if (comment.dislikes.includes(user)) {
      await Comment.updateOne({
        _id: commentId,
      }, {
        $pull: {
          "dislikes": user
        }
      })
    } else if (comment.likes.includes(user)) {
      await Comment.updateOne({
        _id: commentId,
      }, {
        $pull: {
          "likes": user
        }
      })

      return res.status(200).json({
        success: true
      })
    }

    await Comment.updateOne({
      _id: commentId,
    }, {
      $push: {
        "likes": user
      }
    })

    res.status(200).json({
      success: true

    })
  }catch(e) {
    next(e)
  }
}

const dislike = async (req, res, next)=> {
  try {

    const {
      commentId
    } = req.params
    const user = req.user._id
    const comment = await Comment.findOne({
      _id: commentId
    })

    if (comment.likes.includes(user)) {
      await Comment.updateOne({
        _id: commentId,
      }, {
        $pull: {
          "likes": user
        }
      })
    } else if (comment.dislikes.includes(user)) {
      await Comment.updateOne({
        _id: commentId,
      }, {
        $pull: {
          "dislikes": user
        }
      })

      return res.status(200).json({
        success: true
      })

    }

    await Comment.updateOne({
      _id: commentId,
    }, {
      $push: {
        "dislikes": user
      }
    })

    res.status(200).json({
      success: true
    })
  }catch(e) {
    next(e)
  }
}


module.exports = {
  createComment,
  editComment,
  deleteComment,
  like,
  dislike
}