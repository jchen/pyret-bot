# PyretBot
PyretBot is a bot that compiles and executes Pyret in Discord. 

## Installation
PyretBot is built on `node.js` and `npm`. Run
`
npm install
`
into a cloned repository to build necessary files. 

This repository is configured to work with Heroku. Deploying from said repository gets Heroku to automatically install and build the bot. The `Procfile` is provided. 

## Configuration
Your bot token should be assigned to key `BOT_TOKEN` within `.env` or in 'Config Vars' on Heroku. 

## Running
`
node bot.js
`
deploys the bot. 
