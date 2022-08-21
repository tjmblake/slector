# Slector

## Preparing Queries for Web-Scraping

This package is used to create **'Slectors'** _(otherwise known as DOM Queries)_ which you can then use in your Web Scraping | Machine Learning projects.

## Quickstart Guide

Initialise a Node Project.

Install Slector:

`npm install slector -D`

Import Slector:

`import Slector from "slector"; `

Create a Slector options object:

`const options = {collectionTypes: ["test", "test2"] }`

_'collectionTypes' defines the categories you want to be able to link your selections/Slectors to._

Create a new Slector:

`const slector = new Slector(options);`

Open the browser, make your selections, and when you click 'DONE' in the extension - return all your Slector data.

`const res = await slector.slect();`
