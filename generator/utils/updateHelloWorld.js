const {
  compose,
  cond,
  has,
  prop,
  replace,
  tap,
} = require('ramda');

const updateHelloWorld = tree => cond([
  [has('src/components/HelloWorld.vue'), compose(
    tap((xs) => { tree['src/components/HelloWorld.vue'] = xs; }), // eslint-disable-line no-param-reassign
    replace('export', 'import VueTypes from \'vue-types\';\n\nexport'),
    replace('msg: String', 'msg: VueTypes.string'),
    prop('src/components/HelloWorld.vue'),
  )],
])(tree);

module.exports = updateHelloWorld;
