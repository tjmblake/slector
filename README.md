![Slector Banner](./brand/slector-banner.png)

# Slector

## Preparing Queries for Web-Scraping

This package is used to create **'Slectors'** _(otherwise known as DOM Queries)_ which you can then use in your Web Scraping | Machine Learning projects.

## Quickstart Guide

Initialise a Node Project.

### Install Slector:

`npm install slector -D`

### Import Slector:

`import Slector from "slector"; `

### Create a Slector options object:

`const options = {showExtConsole: true, collectionTypes: ["EndPoint", "Method Description"], startUrl: "https://www.coingecko.com/en/api/documentation", slectors: previousSlectors, exportTextContent: true,}`

### Slector Options Available

| Property          | Definition                                                            | Required? |
| ----------------- | --------------------------------------------------------------------- | --------- |
| collectionTypes   | _string[]_: The available Slector names/categories/groups.            | ✅        |
| startUrl          | _string_: The first url to navigate to (_after extension setup_)      | ✅        |
| slectors          | _slectors[]_: Previously exported slector data to load on setup.      | ❌        |
| exportTextContent | _boolean_: Will collect text content of all highlighted DOM elements. | ❌        |
| showExtConsole    | _boolean_: Will open background-script inspector on startup.          | ❌        |

### Create a new Slector Instance:

`const slector = new Slector(options);`

### Run Slector and export data:

`const res = await slector.slect();`

Open the browser, make your selections, and when you click 'DONE' in the extension - return all your Slector Instance JSON data.
