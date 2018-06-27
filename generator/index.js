const yaml = require('js-yaml');

const attachExtends = obj => Object.assign(obj, {
  extends: obj.extends.concat(['plugin:vue-types/strongly-recommended']),
}); /* ({
  ...obj,
  extends: [
    ...obj.extends,
    'plugin:vue-types/strongly-recommended',
  ],
}); */

const processYaml = str => yaml.safeDump(attachExtends(yaml.safeLoad(str)));
const processJS = (str) => {
  const ex = str.match(new RegExp(/['"]{0,1}extends['"]{0,1}:\s{0,1}\[.*\]/, 'smi'))[0];
  const spacing = ex.match(/,\s+/)[0].replace(',', '');
  const insertPoint = ex.lastIndexOf('\'') + 1;
  const outputExtend = `${ex.slice(0, insertPoint)},${spacing}'plugin:vue-types/strongly-recommended'${ex.slice(insertPoint)}`;
  return str.replace(ex, outputExtend);
};
const processJSON = (str, spaces) => JSON.stringify(attachExtends(JSON.parse(str)), null, spaces || '\t');

module.exports = (api) => {
  api.extendPackage({
    dependencies: {
      'vue-types': '^1.3.1',
    },
    devDependencies: {
      'eslint-plugin-vue-types': '^0.1.0',
    },
  });
  // Update ESLint Config
  api.render((tree) => {
    // First step: check if config is in package.joson
    const packageJSON = JSON.parse(tree['package.json']);
    if (Object.prototype.hasOwnProperty.call(packageJSON, 'eslintConfig')) {
      api.extendPackage({
        eslintConfig: attachExtends(packageJSON.eslintConifg),
      });
    } else {
      // Find any eslintrc files:
      const eslintConfigs = Object.keys(tree).filter(file => /eslintrc/.test(file));
      eslintConfigs.forEach((file) => {
        // If file isn't in root directory, skip it:
        if (/\//.test(file)) { return; }
        // Figure out spacing:
        const regOutput = tree[file].match(/^\s+/);
        const spaces = regOutput === null ? false : regOutput[0].length;
        // Build output by file type:
        let output = '';
        // First three tests rely on extension:
        if (/\.js$/.test(file)) {
          output = processJS(tree[file], spaces);
        } else if (/\.json$/.test(file)) {
          output = processJSON(tree[file], spaces);
        } else if (/\.ya{0,1}ml$/.test(file)) {
          output = processYaml(tree[file], spaces);
        } else {
          // This try/catch block checks JSON and YAML first (which will error on syntax errors)
          // before assuming that the file contents are JavaScript.
          try {
            output = processJSON(tree[file], spaces);
          } catch (err) {
            try {
              output = processYaml(tree[file], spaces);
            } catch (err2) {
              output = processJS(tree[file], spaces);
            }
          }
        }
        // Write the output:
        tree[file] = output; // eslint-disable-line no-param-reassign
      });
    }
  });
};
