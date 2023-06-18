# Handle delegations on blockchain

This application is made of different parts:
  - frontend (react)
  - API (express js)
  - blockchain contract (truffle)

## Running application

To run the frontend:

```sh
$ cd client 
$ npm install
$ npm start
```

To run the API:
```sh
$ cd api 
$ npm install
$ npm start
```

To deploy the contract:
```sh
$ cd truffle 
$ npm install
$ truffle migrate --network development
```
Make sure there is a running deployment of Ganache at `http://localhost:7545`

- __Where can I find more resources?__

  This Box is a sweet combo of [Truffle](https://trufflesuite.com) and [Webpack](https://webpack.js.org). Either one would be a great place to start!
