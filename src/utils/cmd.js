const getCommandLineParams = () => ({
    trelloFile: process.argv[process.argv.length - 1]
});

exports.getCommandLineParams = getCommandLineParams;
