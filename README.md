# trello2planka

Import your Trello JSON Export to your self-hosted [planka](https://github.com/plankanban/planka).

Most of this has already been adapted and integrated directly to planka, so you can use the import feature in the web application. With the trello2planka command line tool you can additionally import attachments, archived items, and you get a JSON report file as well. 

## Usage

* Clone this repo and install dependencies with `npm install`. 
* Copy [sample-config.json](sample-config.json) to `config.json` and replace the sample values with your individual ones. Make sure to keep it secret, since it will contain your password in cleartext. 
* Download the Trello JSON Export of your board and put it to `trello-export.json` or something like that.
* Start the Import with `npm run import-board --  --file=trello-export.json`. Of course you can also try it with the provided sample file first, by running `npm run import-sample-board`.

## Features

* Import Trello Board Export to planka (either a new project will be created, or you choose an existing one by id). 
* Import Lists
* Import Cards, including
  * description
  * tasks (with limitations, see #5)
  * comments
  * labels
  * attachments, if configured (needs Trello API config)
* Include archived cards and lists, if configured
* JSON Report containing the mapping of Trello items to created planka items

### Configuration

#### Attachments
If you want to optionally import card attachments from Trello, you need to have a Trello API key and token (see https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/#managing-your-api-key). Put them into the `config.json` as shown in the `sample-config.json` and set `importOptions.fetchAttachments` to `true`. 

#### Archived Items
You can import archived lists and cards to the planka board by setting `importOptions.importArchivedItems` to `true` in the `config.json`. The imported items will have `"[ARCHIVED]"` added to their name, but are of course simply regular items in planka. 

#### Configuring the planka Project
Set `importOptions.existingProjectId` to the ID of the project, in which you want to import the board. Alternatively, remove this option and use `importOptions.createdProjectName` to set a name for the newly created planka project instead.

## Limitations

* Only one board at a time. 
* For simplicity, users/members are not taken care of at all. 
* Not imported yet: 
  * Dates/Timers
  * history/actions (except for comments).

Please also be aware of the [open issues](https://github.com/christophenne/trello2planka/issues). 

## Compatibility

trello2planka (latest develop) is compatible with planka version 1.10.1 and not downwards-compatible anymore. But of course you can always checkout older commits/tags. 

It is being developed and tested with node v18. 

## License

trello2planka is [MIT-Licensed](LICENSE)
