module.exports = {
  base: `module.exports = {
  'extends': [
    'plugin:vue/recommended',
    '@vue/airbnb'
  ]
}`,
  correct: `module.exports = {
  'extends': [
    'plugin:vue/recommended',
    '@vue/airbnb',
    'plugin:vue-types/strongly-recommended'
  ]
}`,
  baseTrailing: `module.exports = {
  'extends': [
    'plugin:vue/recommended',
    '@vue/airbnb',
  ],
}`,
  correctTrailing: `module.exports = {
  'extends': [
    'plugin:vue/recommended',
    '@vue/airbnb',
    'plugin:vue-types/strongly-recommended',
  ],
}`,
  baseFour: `module.exports = {
    'extends': [
        'plugin:vue/recommended',
        '@vue/airbnb'
    ]
}`,
  correctFour: `module.exports = {
    'extends': [
        'plugin:vue/recommended',
        '@vue/airbnb',
        'plugin:vue-types/strongly-recommended'
    ]
}`,
  baseNoLineBreaks: `module.exports = {
  'extends': ['plugin:vue/recommended', '@vue/airbnb']
}`,
  correctNoLineBreaks: `module.exports = {
  'extends': ['plugin:vue/recommended', '@vue/airbnb', 'plugin:vue-types/strongly-recommended']
}`,
};
