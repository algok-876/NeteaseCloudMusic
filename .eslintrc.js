module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'id-match': 2,
    semi: [2, 'always'],
    indent: 2,
    // 对象字面量中冒号的前后空格
    'key-spacing': [2, { beforeColon: false, afterColon: true }],
    'consistent-return': 0,
    'no-shadow': 2,
    'no-dupe-keys': 2, // 在创建对象字面量时不允许键重复 {a:1,a:1}
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }]
  }
};
