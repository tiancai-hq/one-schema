
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended'], // this is optional 
}
/*
module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb-base'],
  plugins: [],
  env: {
    jest: true,
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  rules: {
    'generator-star-spacing': 0,
    'function-paren-newline': 0,
    'import/no-unresolved': [2, { ignore: ['^@/', '^umi/'] }],
    'import/order': 'warn',
    'linebreak-style': 0,
    // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
    'no-prototype-builtins': 'off',
    'import/prefer-default-export': 'off',
    'import/no-default-export': [0, 'camel-case'],
  
    // Use function hoisting to improve code readability
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    // Makes no sense to allow type inferrence for expression parameters, but require typing the response

    'import/no-cycle': 0,

    // issue https://github.com/facebook/react/issues/15204

    // Conflict with prettier
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': 1,
    'object-curly-newline': 0,
    'implicit-arrow-linebreak': 0,
    'operator-linebreak': 0,
    'no-param-reassign': 1,
    'space-before-function-paren': 0,



    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'never'
    }],
    'prefer-object-spread': 0,
    'camelcase': ["error", { ignoreDestructuring: true, "properties": "never" }],


    'no-bitwise': 0,
    'no-unused-vars': ['error', { "args": "none" }],
    'no-plusplus': 0,

  },
  settings: {
  },
};
*/