# Developer notes
Simple tool to generate changelog notes from git commits

Supports 2 formats: `md` and `html`

## Overview
Use the following meta-information in your commits
* `version: 1.0.0` - to identify all commits before this belongs to `1.0.0` version;  
 if you don't have any commit with `version: ...` you'll get `Unstructured commits` as a header version  
 all commits after the last `version` will be marked with `Unreleased` header
* `feat: bla bla` - to include `bla bla` to `Features` section  
feature is something new like new API, functionality, behaviour
* `brk: bla bla` - to include `bla bla` to `Breaking` section  
breaking is to help migrate if some old API is broken
* `note: bla bla` - to include `bla bla` to `Other notes` section  
any other helpful info about your code which only you know about

Any of `bla bla` seciton supports `.md` this means you may use 
* `` `bla bla` `` to mark code  
* `*bla bla*` to make it narrow 
* `**bla bla**` to make it bold

(or event include links if necessary)

## How to use
```text
Usage: node index.js <options>

Where <options>:

--header            main header of changelog file 
                      example: My header

--dir               specify directory in which your repo is located; path can be absolute or relative
                      default: . 
                      example: ../dxchart5
                                           
--output            name of output file
                      example: DEV_NOTES.md
                                            
--version           print notes only for specific version; your commits should contain 'version: 1.1.30' for this to work
                      example: 1.1.30

--format            output format of notes
                      default: md
                      example: html
                                            
--since             gathers notes only starting from specific date
                      default: <empty>
                      example: 13.07.2020           
                                            
--ticketLinkPrefix  prefix for ticket link
                      example: https://jira.my.company.com/browse/                      
```

### Examples
All history with header
```shell script
node index.js --header="My header"
```
Specify repository directory
```shell script
node index.js --dir=../my-repo
```
Output to file
```shell script
node index.js --output=DEV_NOTES.md
```
Only 1 version
```shell script
node index.js --version=1.0.1
```
HTML format
```shell script
node index.js --format=html
```
All since 12th July 2020
```shell script
node index.js --since=12.07.2020
```