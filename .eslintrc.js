module.exports = {
    "extends": [
        "airbnb-base",
        "plugin:react/recommended",
    ],
    "parser": "babel-eslint",
    "rules": {
        "indent": ["warn", 4],
        "quotes": ["warn", "double"],
        "no-console": ["warn"],
        "operator-linebreak": ["warn", "after"],
        "object-curly-newline": ["warn"],
        "no-underscore-dangle": ["warn"],
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "react/prop-types": ["warn"],
    },
    "env": {
        "browser": true,
        "node": true,
    },
};