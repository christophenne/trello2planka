const getCommandLineParams = () => ({
    trelloFile: process.argv[process.argv.length - 1]
});

const getTrelloFilename = () => getOptionValue('--file=');
const getImportProjectName = () => getOptionValue('--import-project-name=');

const getOptionValue = (option) => {
    const argument = process.argv.find(arg => arg.startsWith(option));
    if (argument) {
        return argument.split('=')[1];
    }
}

exports.getCommandLineParams = getCommandLineParams;
exports.getImportProjectName = getImportProjectName;
exports.getTrelloFilename = getTrelloFilename;
