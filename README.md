# Hapi PDF Plugin

Create a PDF file from any web page

## Installation

```
$ npm install --save @magneds/hapi-plugin-pdf
```

## Usage

As the name might have suggested already, this package is a plugin for the Hapi framework, simply registering the package as plugin will suffice.

### Using `@magneds/hapi-server`

```js
const HapiServer = require('@magneds/node-hapi-server');
const HapiPluginPDF = require('@magneds/hapi-plugin-pdf');

new HapiServer()
	.configure({ host: 'localhost', port: 3000 })
	.plugin(HapiPluginPDF)
	.start()
	.then(() => console.log(`Running @${server.info.uri}`));
```

### Using `hapi`

```js
const Hapi = require('hapi');
const HapiPluginPDF = require('@magneds/hapi-plugin-pdf');

const server = Hapi.server({ host: 'localhost', port: 3000 });

const init = async () => {
	await server.register(HapiPluginPDF);
	await server.start();

	console.log(`Running @${server.info.uri}`);
};

init();
```

## API

The pdf plugins registers a single route and works with both the `GET` and `POST` request methods.

### `/pdf/render`

The request is delegated to the provided url using the method used to call the `/pdf/render` endpoint, any GET and/or POST paramater as well as all headers are added to the delegated request.

_NOTE_, the '/pdf' portion of the route is a so-called route prefix, it can be changed to whatever you'd like during registration to Hapi by specifying an alternative.

#### Using `@magneds/hapi-server`

```js
	.plugin({ ...HapiPluginPDF, routes: { prefix: '/my-custom/pdf' } })
```

#### Using `hapi`

```js
	await server.register({ ...HapiPluginPDF, routes: { prefix: '/my-custom/pdf' } });
};

init();
```

```
GET http://localhost:3000/pdf/render?url=https://www.magneds.com
```

(Obviously it will look horrible, as it does not have a decent print stylesheet)
