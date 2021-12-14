const {Pizza} = require('../models');

const pizzaController = {
   getAllPizza(req, res) {
       Pizza.find({})
       .populate({
           path: 'comments',
           select: '-__v'
           //remember this __v field ish
       })
       .select('-__v')
       .sort({_id: -1})
       //this gives us the comments in DESCENDING order
       .then(dbPizzaData => res.json(dbPizzaData))
       .catch(err => {
           console.log(err);
           res.status(400).json(err);
       })
   },

   getPizzaById({ params }, res) {
       Pizza.findOne({_id: params.id})
       .populate({
           path: 'comments',
           select: '-__v'
       })
       .select('-__v')
       .then(dbPizzaData => {
           //if no pizza is found, send 404
           if(!dbPizzaData) {
               res.status(404).json({message: 'NO PIZZA ID... COME ON!!!!'})
               return;
           }
           res.json(dbPizzaData)
       })
       .catch(err => {
           console.log(err);
           res.status(400).json(err);
       });
   },

   createPizza({ body }, res) {
    Pizza.create(body)
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.status(400).json(err));
  },

   updatePizza({ params, body }, res) {
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  },

  deletePizza({params}, res) {
      Pizza.findOneAndDelete({_id: params.id })
      .then(pizzaStuff => {
          if(!pizzaStuff) {
              res.status(404).json({message: "NO PIZZA HERE"})
              return;
          }
          res.json(pizzaStuff);
      })
      .catch(err = res.json(400).json(err));
  }
};

module.exports = pizzaController;
