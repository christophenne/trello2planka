export const getCommandLineParams = () => ({
    trelloFile: process.argv[process.argv.length - 1]
});

export const getTrelloFilename = () => getOptionValue('--file=');
export const getImportProjectName = () => getOptionValue('--import-project-name=');

const getOptionValue = (option) => {
    const argument = process.argv.find(arg => arg.startsWith(option));
    if (argument) {
        return argument.split('=')[1];
    }
}
