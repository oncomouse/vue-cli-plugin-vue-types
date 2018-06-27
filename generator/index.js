const {
  assocPath,
  compose,
  has,
  ifElse,
  prop,
} = require('ramda');
const { handleFileConfigs } = require('./handleFileConfigs');

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
  api.render(tree => compose(
    ifElse(
      has('eslintConfig'),
      // If we are dealing w/ package.json, build the extension object and pass it to
      // api.extendPackage:
      () => api.extendPackage(assocPath(
        ['eslintConfig', 'extends'], // Updating package.eslintConfig.extends
        ['plugin:vue-types/strongly-recommended'], // The value we want to merge with extends
        {}, // Starter object for assocPath
      )),
      () => handleFileConfigs(tree), // Otherwise, hand tree off to handleFileConfigs
    ),
    JSON.parse, // Parse its JSON
    prop('package.json'), // Get package.json from tree
  )(tree));
};
