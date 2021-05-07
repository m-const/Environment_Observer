const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema(
	{
		hostname: {
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
		status: {
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
	},
	{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

const Hosts = mongoose.model('Hosts', RoleSchema);

module.exports = Hosts;
