const express = require('express')
const passport = require('passport')

const Food = require ('../models/food')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.get('/food', (req, res, next) => {

    console.log('route is hit')

    Food.find()
        .populate('owner')
        .then(foods => {
            return foods.map(food => food.toObject())
        })
        .then(foods => {
            // res.status(200).json({ data: response.data.items, foods: foods })
            res.status(200).json({ foods: foods })
        })
        .catch(next)

})

router.get('/foods/:id', (req, res, next) => {
    const id = req.params.id

    Food.findById(id)
        .populate('owner')
        .then(handle404)
        .then((food) => res.status(200).json({ food: food.toObject() }))
        .catch(next)
})

router.post('/foods', requireToken, (req, res, next) => {
	req.body.food.owner = req.user.id

	Food.create(req.body.food)
		.then((food) => {
			res.status(201).json({ food: food.toObject() })
		})
		.catch(next)
})

router.patch('/foods/:id', requireToken, removeBlanks, (req, res, next) => {
	delete req.body.food.owner

	Food.findById(req.params.id)
		.then(handle404)
		.then((food) => {
			requireOwnership(req, food)
			return food.updateOne(req.body.food)
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

router.delete('/foods/:id', requireToken, (req, res, next) => {
	Food.findById(req.params.id)
		.then(handle404)
		.then((food) => {
			requireOwnership(req, food)
			food.deleteOne()
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

module.exports = router