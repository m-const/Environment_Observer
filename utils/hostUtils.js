require('dotenv').config();
const SETTING = {
	//defines behaviour of the sanitize function, bool if the element should be sanitized.
	key: process.env.SANITIZE_KEY.toLowerCase() === 'true' ? true : false,
	value: process.env.SANITIZE_VALUE.toLowerCase() === 'true' ? true : false,
	encryptionKey:
		process.env.SANITIZE_ENCRYPTION_KEY.toLowerCase() === 'true' ? true : false,
	cmd: process.env.SANITIZE_CMD.toLowerCase() === 'true' ? true : false,
	assert: process.env.SANITIZE_ASSERT.toLowerCase() === 'true' ? true : false,
	//the text returned instead of the field contents
	message: process.env.SANITIZE_MSG,
};
function sanitizeHostObject(host) {
	//get the fields array of the host and sanitize
	let sanitizedFields = [];
	let x = 0;
	for (const item of host.fields) {
		if (item.encrypted === true) {
			let obj = {
				_id: item._id,
				encrypted: true,
				key: SETTING.key ? SETTING.message : item.key,
				value: SETTING.value ? SETTING.message : item.value,
				encryptionKey: SETTING.encryptionKey
					? SETTING.message
					: item.encryptionKey,
			};
			sanitizedFields[x] = obj;
		} else {
			sanitizedFields[x] = item;
		}
		x++;
	}
	//sanitize the tool CMD if set
	let sanitizedTools = [];
	let y = 0;
	for (const item of host.tools) {
		if (SETTING.cmd === true) {
			let obj = {
				_id: item._id,
				description: item.description,
				tool: item.tool,
				cmd: SETTING.cmd ? SETTING.message : item.cmd,
				assert: SETTING.assert ? SETTING.message : item.assert,
			};
			sanitizedTools[y] = obj;
		} else {
			sanitizedTools[y] = item;
		}
		y++;
	}
	//rebuild the entire Object
	const returnHost = {
		_id: host._id,
		hostname: host.hostname,
		description: host.description,
		tools: [sanitizedTools],
		fields: [sanitizedFields],
		createdAt: host.createdAt,
		updatedAt: host.updatedAt,
	};
	return returnHost;
}

module.exports = {
	sanitize(hosts) {
		//this function accepts the raw host list from db. We need to remove encrypted field values and replace with an informative flag.
		if (Array.isArray(hosts)) {
			let sanitizedHosts = [];
			let c = 0;
			for (const obj of hosts) {
				sanitizedHosts[c] = sanitizeHostObject(obj);
				c++;
			}
			return sanitizedHosts;
		} else {
			return sanitizeHostObject(hosts);
		}
	},
};
