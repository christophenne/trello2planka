# trello2planka

Import your Trello JSON Export to your self-hosted [planka](https://github.com/plankanban/planka).

## Usage for now

* Install dependencies with `npm install`. 
* Copy [sample-config.json](sample-config.json) to `config.json` and replace the sample values with your individual ones.
* Download the Trello JSON Export of your board and put it to `trello-export.json` or something like that.
* Start the Import with `npm run import-board -- --import-project-name="Trello Import" --file=trello-export.json`. Of course you can also try it with the provided sample file first, by running `npm run import-sample-board`.

## License

trello2planka is [MIT-Licensed](LICENSE)
