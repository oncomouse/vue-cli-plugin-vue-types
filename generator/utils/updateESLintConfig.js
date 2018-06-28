const {
  both,
  compose,
  equals,
  filter,
  ifElse,
  keys,
  length,
  test,
} = require('ramda');
const fs = require('fs');
const { handleFileConfigs } = require('./handleFileConfigs');

const updateESLintConfig = (tree, api) => compose(
  ifElse(
    compose(equals(0), length),
    () => api.extendPackage({
      eslintConfig: {
        extends: ['plugin:vue-types/strongly-recommended'],
      },
    }),
    () => handleFileConfigs(tree),
  ),
  filter(both(
    fs.existsSync,
    test(/^[^/]*eslintrc/),
  )),
  keys,
)(tree);

module.exports = updateESLintConfig;
