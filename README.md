# chation-web
This is a web client for Chation.

![chation_screenshot.png](docs/chation_screenshot.png)

# Setup

## Setup Environment Variables

You create a ```.env``` file into root directory:

``` 
DOMAIN=xxx.auth0.com
CLIENT_ID=
REDIRECT_URL=http://localhost:8080/auth/callback
AUDIENCE=https://xxx.auth0.com/userinfo
RESPONSE_TYPE=token id_token
SCOPE=openid
REST_SERVER_URI=http://localhost:3000
```

## Setup Mock Server

This sample uses RESTful mock server. It's repository is [here](https://github.com/sunada-ke/chation-mock-server).

``` bash
$ git clone https://github.com/sunada-ke/chation-mock-server.git
$ yarn install
$ yarn run start
```

After Running the mock server, you can fetch json data.

``` bash
$ curl  http://localhost:3000/rooms
```

# Start

``` bash
$ yarn install
$ yarn run dev
```