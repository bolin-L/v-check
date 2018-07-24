const path = require("path");

module.exports = {
  parser: "babel-eslint",
  extends: "airbnb-base",
  globals: {
    "Promise": true,
    "window": true,
    "weex": true,
    "document": true,
    "Vue": true,
  },
  rules: {
    "arrow-parens": ["error", "as-needed"],
    "import/extensions": "off",
    "indent": ["error", 4],
    "class-methods-use-this": "off",
    "no-plusplus": "off",
    "no-param-reassign": "off",
    "global-require": "off",
    "max-len": ["error", 200],
    "no-console":  process.env.NODE_ENV === "development" ? "off" : "warn",
    "no-debugger": process.env.NODE_ENV === "development" ? "off" : "error",
    "no-restricted-syntax": [
      "error",
      "LabeledStatement",
      "WithStatement"
    ],
    "no-underscore-dangle": "off",
    "import/no-unresolved": ["error", {
      "ignore": ["week-ui", "weex-kit"]
    }]
  },
  settings: {
    "import/resolver": {
      webpack: {
        config: path.resolve(__dirname, "./webpack.base.js")
      }
    }
  }
};