module.exports = {
  env: {
    browser: true,
    commonjs: true, 
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    
    quotes: ["error", "single"],
    eqeqeq: ["error", "smart"],
  },
  
};
