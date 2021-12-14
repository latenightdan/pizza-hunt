const { Comment, Pizza } = require('../models');

const CommentController = {
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
            .then(({ _id }) => {
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $push: { comments: _id } },
                    { new: true }
                );
            })
            .then(gimmePizza => {
                if (!gimmePizza) {
                    res.status(400).json({ message: "NO PIZZA HERE!" })
                    return;
                }
                res.json(gimmePizza);
            })
            .catch(err => res.json(err));
    },

    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(404).json({ message: 'NO COMMENT HERE BUDDY' })
                }
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $pull: { comments: params.commentId } },
                    { new: true }
                );
            })
            .then(gimmePizza => {
                if(!gimmePizza) {
                    res.status(404).json({ message: 'NO PIZZA BRO'})
                    return;
                }
                res.json(gimmePizza);
            })
            .catch(err => res.json(err));
    }
};

module.exports = CommentController;