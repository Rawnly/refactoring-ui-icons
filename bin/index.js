#!/usr/bin/env node

const path = require('path');
const camelCase = require('lodash/camelCase');
const upperFirst = require('lodash/upperFirst');

const { parseArgs, isSVG, readDir, readFile, writeFile } = require('./util');

const defaultIconsFolder = path.join('icons');
const defaultComponentsFolder = path.join('src', 'components', 'Icons');

const { src = defaultIconsFolder, output = defaultComponentsFolder } = parseArgs(process.argv.slice(2));

const formatFile = (filename) => {
	const name = upperFirst(camelCase(filename.replace(/\.svg|icon-/g, '')));

	return {
		oldName: filename.replace(/\.svg|icon-/g, ''),
		path: path.join(src, filename),
		name: name,
	};
};

(async () => {
	try {
		const files = await readDir(src);
		const icons = files.filter(isSVG).map(formatFile);

		const indexJSContent = await Promise.all(
			icons.map(async (icon) => {
				try {
					const content = await readFile(icon.path);

					const exportCode = `export * from './${icon.name}';`;

					const { path: p, code } = {
						path: path.join(output, `${icon.name}.jsx`),
						code: `export const ${
							icon.name
						} = ({ style, className, primary = 'primary', secondary = 'secondary' }) => (${content
							.replace(/class/g, 'className')
							.replace(/className="icon-(.*?)"/, '')
							.replace('<svg', '<svg className={className} style={style}')
							.replace(/className="(secondary|primary)"/g, 'className={$1}')})`,
					};

					await writeFile(p, code);

					return exportCode;
				} catch (error) {
					console.error(error);
					process.exit(0);
				}
			}),
		);

		await writeFile(path.join(output, 'index.js'), indexJSContent.join('\n'));
		await writeFile(
			path.join(output, 'icons-list.json'),
			JSON.stringify(
				icons.map((item) => ({ icon: item.name, name: item.oldName })),
				null,
				2,
			),
		);

		console.log(`${icons.length} Icons successfully generated`);
	} catch (error) {
		console.error(error);
	}
})();
