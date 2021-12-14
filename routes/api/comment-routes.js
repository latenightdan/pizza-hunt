const router = require('express').Router();

const { addComment,
    removeComment
} = require('../../controllers/comment-controller');

// /api/comments/<pizzaId>
router.route('/:pizzaId')
.post(addComment);

// /api/comments/<pizzaId>/<commentId>
//you have to specify the route twice so that you know which pizza it belongs to
//just the comment. same idea as activity, but destructured on dif pages.
router.route('/:pizzaId/:commentId')
.delete(removeComment);

module.exports = router;