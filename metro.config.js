const nodelibs = require("node-libs-react-native");

module.exports = {
    resolver: {
        extraNodeModules: nodelibs,
    },
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
};
