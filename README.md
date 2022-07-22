# General info

This is a small game developed using Kaboom.js, Web Audio API and some Node.js packages for setting up a backend.

Use arrow keys to move a player and collect instrument items to play a certain instrument or section of a song. After all items are collected, request will be sent to backend which will respond with info about the song.

## Dependencies

Run `npm install` to install all the dependencies.

Backend was developed using this packages: 

- express (sets up backend functionality)
- cors (allows cross origin resource sharing?)
- axios (handles request sent to RAPID API HUB)
- dotenv (processes API key so it can be hidden)
- nodemon (listen to changes on server)

Node v14.17.3

## Initialization

- Backend is run using: npm run start:backend
- Frontend is run using VS code live server