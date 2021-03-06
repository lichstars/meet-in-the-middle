# Meet in the middle to eat

This was a 2014 hobby app hacked together in native Javascript that I've brought back from the dead.

It is now, a single page web application built in ReactJs that plots your friends on a map and then finds the middle point for you all to meet. Ability to search for restaurants around the meeting point is available.

This app heavily depends on Google APIs.

## Screenshot
![screenshot](https://github.com/lichstars/meet-in-the-middle/blob/master/screenshot/app.png)


## Links
- [Google API starting point](https://developers.google.com/maps/documentation/javascript/tutorial)


## Prerequisites

Install the following software:

- Git: https://git-scm.com
- Docker: https://www.docker.com
- Requires a [Google API Key](https://developers.google.com/maps/documentation/javascript/get-api-key) and plugged into `index.html`
- Require the following Google APIs
  - Directions API
  - Distance Matrix API
  - Geocoding API
  - Maps JavaScript API
  - Places API

## Development

This app was created with [create-react-app](https://github.com/facebookincubator/create-react-app).

It can be built, tested and run, with or without docker.

#### With Docker
- Dependencies
    - docker


- Start a local development server
    - `auto/start`
    - Navigate to http://localhost:3000


- Run the tests
    - `auto/test`


- Get a shell in the dev environment
    - `auto/dev-environment`

#### Without Docker
- Dependencies
    - Node
    - NPM


- Install dependencies
    - `npm install`


- Build
    - `npm run build`


- Start a local development server
    - `npm start`
    - Navigate to http://localhost:3000


- Run the tests
    - `npm test`
