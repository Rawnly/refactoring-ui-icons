const fs = require('fs');
const path = require('path');

const isFlag = (el) => /^(--|-)/g.test(el);
const formatFlag = (el) => el.replace(/^(--|-)/, '');
const toPrimitive = (val) => (val === 'true' ? true : val === 'false' ? false : parseInt(val) ? Number(val) : val);

module.exports.readDir = (dirPath) =>
	new Promise((resolve, reject) => fs.readdir(dirPath, (err, files) => (err ? reject(err) : resolve(files))));

module.exports.readFile = (filePath) =>
	new Promise((resolve, reject) => fs.readFile(filePath, 'utf8', (err, data) => (err ? reject(err) : resolve(data))));

module.exports.writeFile = (filePath, content) =>
	new Promise((resolve, reject) => fs.writeFile(filePath, content, (err) => (err ? reject(err) : resolve())));

module.exports.isSVG = (file) => path.extname(file).includes('svg');

module.exports.parseArgs = (arguments) =>
	arguments.reduce((flags, arg, idx, args) => {
		const nextElement = args[idx + 1];

		if (isFlag(arg) && (!nextElement || isFlag(nextElement))) {
			flags[formatFlag(arg)] = true;
		} else if (isFlag(arg)) {
			flags[formatFlag(arg)] = toPrimitive(args[idx + 1]);
		}

		return flags;
	}, {});
