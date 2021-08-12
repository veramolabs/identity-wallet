module.exports = {
    root: true,
    extends: ["@react-native-community"],
    rules: {
        quotes: ["error", "double", { allowTemplateLiterals: true }],
        "space-in-brackets": [0],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["off"],
    },
};
