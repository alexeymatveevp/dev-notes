# Developer notes
Simple tool to generate changelog notes from git commits

Supports `.md` format

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
                                           
--output            name of output file
                      default: DEV_NOTES.md
                                            
--version           print notes only for specific version; your commits should contain 'version: 1.1.30' for this to work
                      example: 1.1.30
                                            
--since             gathers notes only starting from specific date
                      default: <empty>
                      example: 13.07.2020                      
```

### Examples
All history
```shell script
node index.js
```
Provide header
```shell script
node index.js --header="My header"
```
Output to file
```shell script
node index.js --header="My header" --output=DEV_NOTES.md
```
Only 1 version
```shell script
node index.js --header="My header" --output=DEV_NOTES.md --version=1.0.1
```
Only 1 version since 12th July 2020
```shell script
node index.js --header="My header" --output=DEV_NOTES.md --version=1.0.1 --since=12.07.2020
```