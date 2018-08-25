# Meet in the middle to eat

This was a 2014 hobby app hacked together in native Javascript that I've brought back from the dead.

It is now, a single page web application built in ReactJs that plots your friends on a map and then finds the middle point for you all to meet. Ability to search for restaurants around the meeting point is available.

This app heavily depends on Google APIs.


## Links
- [Google API starting point](https://developers.google.com/maps/documentation/javascript/tutorial)


## Prerequisites

Install the following software:

- Git: https://git-scm.com
- Docker: https://www.docker.com
- Requires a [Google API Key](https://developers.google.com/maps/documentation/javascript/get-api-key) and plugged into `index.html`

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
    - Yarn


- Install dependencies
    - `yarn install`


- Build
    - `yarn run build`


- Start a local development server
    - `yarn start`
    - Navigate to http://localhost:3000


- Run the tests
    - `yarn test`
