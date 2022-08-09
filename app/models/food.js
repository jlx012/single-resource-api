const mongoose = require('mongoose')

const { Schema, model } = mongoose

const foodSchema = new Schema(
    {
        name: String,
        type: String,
        description: String,
        yummy: Boolean,
        owner: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
    }, {
        timestamps: true,
    }
)

module.exports = model('Food', foodSchema)