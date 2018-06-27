const yaml = require('js-yaml');
const {
  __,
  add,
  always,
  assoc,
  compose,
  concat,
  cond,
  equals,
  evolve,
  findLastIndex,
  filter,
  ifElse,
  keys,
  length,
  map,
  match,
  nth,
  propIs,
  replace,
  slice,
  T,
  test,
  tryCatch,
} = require('ramda');

const attachExtends = evolve({
  extends: concat(__, ['plugin:vue-types/strongly-recommended']),
});

const processYaml = (str, spaces) => compose(
  xs => yaml.safeDump(xs, { indent: spaces.length }),
  attachExtends,
  yaml.safeLoad,
)(str);
const processJSON = (str, spaces) => compose(
  x => JSON.stringify(x, null, spaces || '\t'),
  attachExtends,
  JSON.parse,
)(str);
const processJS = (str) => {
  // Find the extends property from the source string:
  const ex = compose(
    nth(0),
    match(new RegExp(/['"]{0,1}extends['"]{0,1}:\s{0,1}\[.*\]/, 'smi')),
  )(str);
  if (ex === undefined) {
    return str;
  }
  // Determine how much spacing do we have to insert at the beginning of the line:
  const spacing = compose(
    replace(',', ''),
    nth(0),
    match(/,\s+/),
  )(ex);
  // This looks really complicated (and it is), but we have to check if the last item in extend is
  // a trailing comma or a space. If there is a trailing comma, we insert after it. If not, we
  // insert after the last quote.
  const insertPoint = ifElse(
    compose(
      equals(1),
      length,
      nth(0),
      slice(-1, Infinity),
      match(/['"],{0,1}/g),
    ),
    compose(add(__, 1), findLastIndex(test(/['"]/))),
    findLastIndex(equals(',')),
  )(ex);
  // Do the replacement:
  return replace(
    ex,
    `${ex.slice(0, insertPoint)},${spacing}'plugin:vue-types/strongly-recommended'${ex.slice(insertPoint)}`,
  )(str);
};

const spaces = compose(
  ifElse(
    compose(equals(0), length),
    always(false),
    compose(length, nth(0)),
  ),
  match(/^\s+/),
);

const handleFileConfig = (file, src) => compose(
  // After processing the source, return an object w/ filename and modified source
  assoc('src', __, { file }),
  // Big test to determine what syntax we are working with:
  cond([
    // If the file name has slashes (ie. is not a root eslintrc), return undefined and remove later:
    [test(/\//), always(undefined)],
    // Test if the file is a .js file:
    [test(/\.js$/), () => processJS(src, spaces(src))],
    // Test if the file is a .json file:
    [test(/\.json$/), () => processJSON(src, spaces(src))],
    // Test if the file is a .yml or .yaml file:
    [test(/\.ya{0,1}ml/), () => processYaml(src, spaces(src))],
    // Otherwise, this lowkey nightmare of a tryCatch block:
    // The way this works is if there is no file extension, we have to guess the syntax. We guess
    // the syntax by try-ing JSON.parse and yaml.safeLoad, which both throw errors if they find
    // syntax errors. If those both throw, we assume JS syntax and run that.
    [T, () => tryCatch(
      () => processJSON(src, spaces(src)), // Try JSON
      tryCatch( // If JSON throws an error, another try/catch block
        () => processYaml(src, spaces(src)), // Try YAML
        () => processJS(src, spaces(src)), // If YAML throws an error, assume JavaScript
      ),
    )()],
  ]),
)(file);

const handleFileConfigs = tree => compose(
  map((obj) => {
    tree[obj.file] = obj.src; // eslint-disable-line no-param-reassign
    return obj;
  }),
  filter(propIs(Object)),
  map(file => handleFileConfig(file, tree[file])),
  filter(test(/eslintrc/)),
  keys,
)(tree);

module.exports = { handleFileConfigs, attachExtends };
