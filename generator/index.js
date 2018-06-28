const updateHelloWorld = require('./utils/updateHelloWorld');
const updateESLintConfig = require('./utils/updateESLintConfig');

module.exports = (api) => {
  api.extendPackage({
    dependencies: {
      'vue-types': '^1.3.1',
    },
  });
  api.render(updateHelloWorld);
  if (api.hasPlugin('eslint')) {
    api.extendPackage({
      devDependencies: {
        'eslint-plugin-vue-types': '^0.1.0',
      },
    });
    api.render(tree => updateESLintConfig(tree, api));
  }
};
