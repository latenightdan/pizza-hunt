const { Comment, Pizza } = require('../models');

const CommentController = {
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
            .then(({ _id }) => {
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $push: { comments: _id } },
                    //addToSet will do the same as push but prevent duplicates
                    { new: true, runValidators: true }
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
    addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
          { _id: params.commentId },
          { $push: { replies: body } },
          { new: true, runValidators: true }
        )
          .then(gimmePizza => {
            if (!gimmePizza) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
            }
            res.json(gimmePizza);
          })
          .catch(err => res.json(err));
      },
removeReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
      .then(dbPizzaData => res.json(dbPizzaData))
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