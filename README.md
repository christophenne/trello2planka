# trello2planka

Import your Trello JSON Export to your self-hosted [planka](https://github.com/plankanban/planka).

Note that this merely serves as a proof of concept / playground. Most of this has already been adapted and integrated directly to planka, where you can use the import feature directly in the web application. The only thing that is not available in the web application right now, is the import of the Trello attachments. 

## Usage

* Install dependencies with `npm install`. 
* Copy [sample-config.json](sample-config.json) to `config.json` and replace the sample values with your individual ones.
* Download the Trello JSON Export of your board and put it to `trello-export.json` or something like that.
* Start the Import with `npm run import-board --  --file=trello-export.json`. Of course you can also try it with the provided sample file first, by running `npm run import-sample-board`.

## Features

* Import Trello Board Export to planka (board will be created in a new planka project). 
* Import Lists
* Import Cards, including
  * description
  * tasks (with limitations, see #5)
  * comments
  * labels
  * attachments, if configured (needs Trello API config)

### Configuration

If you want to optionally import card attachments from Trello, you need to have a Trello API key and token (see https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/#managing-your-api-key). Put them into the `config.json` as shown in the `sample-config.json` and set `importOptions.fetchAttachments` to `true`. 

## Limitations

* Only one board at a time. 
* For simplicity, users/members are not taken care of at all. 
* Archived lists and cards are not imported, since planka has no archiving feature. 
* Not imported yet: history/actions

## Compatibility

This is being developed with planka version 1.9.2.

## License

trello2planka is [MIT-Licensed](LICENSE)
