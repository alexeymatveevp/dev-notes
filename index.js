const child = require("child_process");
const fs = require("fs");
const minimist = require('minimist');

/** Parse program arguments */
const ARG_HEADER = 'header';
const ARG_DIR = 'dir';
const ARG_OUTPUT = 'output';
const ARG_VERSION = 'version';
const ARG_SINCE = 'since';
const arguments = minimist(process.argv.slice(2));
const header = arguments[ARG_HEADER];
const directory = arguments[ARG_DIR] || '.';
const outputFile = arguments[ARG_OUTPUT] || 'DEV_NOTES.md';
const specificVersion = arguments[ARG_VERSION];
const since = arguments[ARG_SINCE];

/** Git log and build structure */
const FEATURE = 'feat: ';
const BREAKING = 'brk: ';
const OTHER_NOTES = 'note: ';
const VERSION = 'version: ';

const TICKET_REGEX = /\[\D+-\d+]/gi;

const output = child
    .execSync(`git --git-dir ${directory}/.git log --format=%B----DELIMITER---- --reverse ${since ? '--since='+since : ''}`)
    .toString("utf-8");

const commitsArray = output
    .split("----DELIMITER----\n")
    .map(commit => {
        const message = commit;
        let result = { message };
        if (message.indexOf(VERSION) !== -1) {
            const version = message.substring(message.indexOf(VERSION) + VERSION.length);
            result.version = version.trim();
        }
        return result;
    });

const structure = [];
let features = [];
let breaking = [];
let otherNotes = [];
let tickets = [];

commitsArray.forEach(commit => {
    if (commit.version) {
        structure.push(
            {
                version: commit.version,
                features: features,
                breaking: breaking,
                otherNotes: otherNotes,
                tickets: tickets
            }
        )
        features = [];
        breaking = [];
        otherNotes = [];
        tickets = [];
    }
    const message = commit.message;
    const featureMsg = tryGetMessage(message, FEATURE);
    if (featureMsg) {
        features.push(featureMsg);
    }
    const breakingMsg = tryGetMessage(commit.message, BREAKING);
    if (breakingMsg) {
        breaking.push(breakingMsg);
    }
    const otherNotesMsg = tryGetMessage(message, OTHER_NOTES);
    if (otherNotesMsg) {
        otherNotes.push(otherNotesMsg);
    }
    // assume
    let match = message.match(TICKET_REGEX);
    if (match && message.indexOf(match[0]) < 5) {
        let ticketMsg = message.substring(message.indexOf(match[0]));
        ticketMsg = getToLineEnd(ticketMsg);
        tickets.push(ticketMsg);
    }
});
if (structure.length === 0) {
    structure.push(
        {
            version: "Unstructured commits",
            features: features,
            breaking: breaking,
            otherNotes: otherNotes,
            tickets: tickets
        }
    )
}
if (features.length !== 0 || breaking.length !== 0 || otherNotes.length !== 0 || tickets.length !== 0) {
    structure.push(
        {
            version: "Unreleased",
            features: features,
            breaking: breaking,
            otherNotes: otherNotes,
            tickets: tickets
        }
    )
}
structure.reverse();

/** Format and output */
const changelog = generateChangelog(structure, header, specificVersion);
console.log(`${changelog}`);
fs.writeFileSync(`./${outputFile}`, `${changelog}`);

/** Functions */
function tryGetMessage(row, prefix) {
    const idx = row.indexOf(prefix);
    if (idx !== -1) {
        let s = row.substring(idx + prefix.length);
        return getToLineEnd(s);
    }
}

function getToLineEnd(line) {
    if (line.indexOf('\n') !== -1) {
        line = line.substring(0, line.indexOf('\n'))
    }
    return line;
}

function generateChangelog(structure, header, specificVersion) {
    let changelog = [];
    if (header) {
        changelog.push(`#${header}`);
    }
    if (specificVersion) {
        structure = structure.filter(item => item.version === specificVersion);
    }
    structure.forEach(item => {
        changelog.push(`\n##${item.version}`);
        generateHeader(changelog, "Feature", item.features);
        generateHeader(changelog, "Breaking", item.breaking);
        generateHeader(changelog, "Other notes", item.otherNotes);
        generateHeader(changelog, "Tickets", item.tickets, (m) => {
            const ticketStr = m.match(TICKET_REGEX)[0];
            let ticketNumber = ticketStr.substring(1, ticketStr.length - 1);
            let ticketMsg = m.substring(m.indexOf(ticketStr) + ticketStr.length).trim();
            return `[${ticketNumber}](https://jira.in.devexperts.com/browse/${ticketNumber}) ${ticketMsg}`;
        });
    });
    return changelog.join("");
}

function generateHeader(changelog, headerName, messages, messageConvertFn) {
    if (messages && messages.length !== 0) {
        changelog.push(`\n###${headerName}`)
        messages.forEach(m => {
            if (messageConvertFn) {
                m = messageConvertFn(m);
            }
            changelog.push(`\n* ${m}`);
        });
    }
}