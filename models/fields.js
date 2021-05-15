const mongoose = require('mongoose');

const fieldsSchema = new mongoose.Schema(
	{
		hostId: {
			type: String,
			required: true,
		},
		url: {
			type: String,
		},
		description: {
			type: String,
			required: true,
		},
		status: [
			{
                _id: {
					type: String,
					required: true,
				},
                description: {
					type: mongoose.ObjectID,
					required: true,
				},
				tool: {
					type: String,
					required: true,
				},
				cmd: {
					type: String,
					required: true,
				},
				assert: {
					type: String,
					required: true,
				},
			},
		],
	},
	{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

const Fields = mongoose.model('Fields', fieldsSchema);

module.exports = Fields;
