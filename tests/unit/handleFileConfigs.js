const { expect } = require('chai');
const eslintrcJsSrc = require('../fixtures/mockEslintrc');
const eslintrcJsonSrc = require('../fixtures/mockEslintrc.json');
const eslintrcYamlSrc = require('../fixtures/mockEslintrc.yaml');
const { handleFileConfigs, attachExtends } = require('../../generator/utils/handleFileConfigs');

describe('attachExtends', () => {
  it('should attach "plugin:vue-types/strongly-recommended" to an array at object.extends', () => {
    expect(attachExtends({ extends: [] })).to.deep.equal({
      extends: ['plugin:vue-types/strongly-recommended'],
    });
  });
  it('should attach "plugin:vue-types/strongly-recommended" at the end of object.extends', () => {
    expect(attachExtends({ extends: ['foobar'] })).to.deep.equal({
      extends: ['foobar', 'plugin:vue-types/strongly-recommended'],
    });
  });
  it('should return object if object has no extends prop', () => {
    expect(attachExtends({ foobar: false })).to.deep.equal({ foobar: false });
  });
});
describe('handlFileConfigs', () => {
  it('should process a JS file', () => {
    const tree = {
      '.eslintrc.js': eslintrcJsSrc.base,
    };
    handleFileConfigs(tree);
    expect(tree['.eslintrc.js']).to.equal(eslintrcJsSrc.correct);
  });
  it('should ignore a non-root JS file', () => {
    const tree = {
      'test/.eslintrc.js': eslintrcJsSrc.base,
    };
    handleFileConfigs(tree);
    expect(tree['test/.eslintrc.js']).to.equal(eslintrcJsSrc.base);
  });
  it('should process a JS file w/ a trailing comma', () => {
    const tree = {
      '.eslintrc.js': eslintrcJsSrc.baseTrailing,
    };
    handleFileConfigs(tree);
    expect(tree['.eslintrc.js']).to.equal(eslintrcJsSrc.correctTrailing);
  });
  it('should process a JS file w/ four spaces', () => {
    const tree = {
      '.eslintrc.js': eslintrcJsSrc.baseFour,
    };
    handleFileConfigs(tree);
    expect(tree['.eslintrc.js']).to.equal(eslintrcJsSrc.correctFour);
  });
  it('should process a JS file w/ no line breaks in extends', () => {
    const tree = {
      '.eslintrc.js': eslintrcJsSrc.baseNoLineBreaks,
    };
    handleFileConfigs(tree);
    expect(tree['.eslintrc.js']).to.equal(eslintrcJsSrc.correctNoLineBreaks);
  });
  it('should process a JSON file', () => {
    const tree = {
      '.eslintrc.json': JSON.stringify(eslintrcJsonSrc.base, null, '\t'),
    };
    handleFileConfigs(tree);
    expect(tree['.eslintrc.json']).to.equal(JSON.stringify(eslintrcJsonSrc.correct, null, '\t'));
  });
  it('should process a YAML file', () => {
    const tree = {
      '.eslintrc.yaml': eslintrcYamlSrc.base,
      '.eslintrc.yml': eslintrcYamlSrc.base,
    };
    handleFileConfigs(tree);
    expect(tree['.eslintrc.yaml']).to.equal(eslintrcYamlSrc.correct);
    expect(tree['.eslintrc.yml']).to.equal(eslintrcYamlSrc.correct);
  });
  it('should process YAML when given a YAML mystery file', () => {
    const tree = {
      '.eslintrc': eslintrcYamlSrc.base,
    };
    handleFileConfigs(tree);
    expect(tree['.eslintrc']).to.equal(eslintrcYamlSrc.correct);
  });
  it('should process JSON when given a JSON mystery file', () => {
    const tree = {
      '.eslintrc': JSON.stringify(eslintrcJsonSrc.base, null, '\t'),
    };
    handleFileConfigs(tree);
    expect(tree['.eslintrc']).to.equal(JSON.stringify(eslintrcJsonSrc.correct, null, '\t'));
  });
  it('should process JS when given a JS mystery file', () => {
    const tree = {
      '.eslintrc': eslintrcJsSrc.base,
    };
    handleFileConfigs(tree);
    expect(tree['.eslintrc']).to.equal(eslintrcJsSrc.correct);
  });
});
