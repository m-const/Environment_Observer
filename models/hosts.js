const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema(
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
		tools: [
			{
				

				description: {
					type: String,
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
				},
			},
		],
		fields: [
			{
				
				key: {
					type: String,
					required: true,
				},
				value: {
					type: String,
				},
				encrypted: {
					default: false,
					type: Boolean
				},
				encryptionKey:{
					type: String
				}
			},
		],
	},
	{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

const Hosts = mongoose.model('Hosts', hostSchema);

module.exports = Hosts;
