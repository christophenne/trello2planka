# trello2planka

Import your Trello JSON Export to your self-hosted [planka](https://github.com/plankanban/planka).

Note that this merely serves as a proof of concept / playground. Most of this has already been adapted and integrated directly to planka, where you can use the import feature directly in the web application. 

## Usage for now

* Install dependencies with `npm install`. 
* Copy [sample-config.json](sample-config.json) to `config.json` and replace the sample values with your individual ones.
* Download the Trello JSON Export of your board and put it to `trello-export.json` or something like that.
* Start the Import with `npm run import-board -- --import-project-name="Trello Import" --file=trello-export.json`. Of course you can also try it with the provided sample file first, by running `npm run import-sample-board`.

## Features

* Import Trello Board Export to planka (board will be created in a new planka project). 
* Import Lists
* Import Cards, including
  * description
  * tasks (with limitations, see #5)
  * comments
  * labels


## Limitations

* Only one board at a time. 
* For simplicity, users/members are not taken care of at all. 
* Archived lists and cards are not imported, since planka has no archiving feature. 
* Not imported yet: attachments, history/actions

## Compatibility

This is being developed with planka version 1.9.2.

## License

trello2planka is [MIT-Licensed](LICENSE)
