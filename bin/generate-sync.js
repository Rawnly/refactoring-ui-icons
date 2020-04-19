#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const camelCase = require('lodash/camelCase');
const upperFirst = require('lodash/upperFirst');

const { parseArgs } = require('./util');

const defaultIconsFolder = path.join('icons');
const defaultComponentsFolder = path.join('src', 'components', 'Icons');

const { src = defaultIconsFolder, output = defaultComponentsFolder } = parseArgs(process.argv.slice(2));

(() => {
	try {
		const icons = fs
			.readdirSync(src)
			.filter((file) => path.extname(file).includes('svg'))
			.map((filename) => {
				const name = upperFirst(camelCase(filename.replace(/\.svg|icon-/g, '')));

				return {
					oldName: filename.replace(/\.svg|icon-/g, ''),
					path: path.join(src, filename),
					name: name,
				};
			});

		const indexJS = icons
			.map((icon) => {
				const content = fs.readFileSync(icon.path, 'utf8');

				const exportCode = `export * from './${icon.name}';`;

				const Component = {
					path: path.join(output, `${icon.name}.jsx`),
					code: `export const ${
						icon.name
					} = ({ style, className, primary = 'primary', secondary = 'secondary' }) => (${content
						.replace(/class/g, 'className')
						.replace(/className="icon-(.*?)"/, '')
						.replace('<svg', '<svg className={className} style={style}')
						.replace(/className="(secondary|primary)"/g, 'className={$1}')})`,
				};

				fs.writeFileSync(Component.path, Component.code);

				return exportCode;
			})
			.join('\n');

		fs.writeFileSync(path.join(output, 'index.js'), indexJS);
		fs.writeFileSync(
			path.join(output, 'icons-list.json'),
			JSON.stringify(
				icons.map((item) => ({ icon: item.name, name: item.oldName })),
				null,
				2,
			),
		);
	} catch (error) {
		console.error(error);
	}
})();
