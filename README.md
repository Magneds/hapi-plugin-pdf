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

The request is delegated to the provided url using the method used to call the `/pdf/render` endpoint, any GET and/or POST parameter as well as all headers are added to the delegated request.

#### GET request

A GET request only requires a (properly encoded) `url` parameter, which contains the url to the web page to render as PDF.

Any header provided will be provided to the final destination.

#### POST request

Like the GET request, a POST request also only requires the `url` parameter, which may be provided in either the payload (body) or as parameter to the url.

All headers and payload data will be provided to the final destination.

#### Changing the path prefix

The '/pdf' portion of the route is a so-called route prefix, it can be changed to whatever you'd like during registration to Hapi by specifying an alternative.

##### Using `@magneds/hapi-server`

```js
	//...
	//  rename the /pdf/render path to /my-custom/pdf/render
	.plugin({ ...HapiPluginPDF, routes: { prefix: '/my-custom/pdf' } })
	//..
```

##### Using `hapi`

```js
	//...
	//  rename the /pdf/render path to /my-custom/pdf/render
	await server.register({ ...HapiPluginPDF, routes: { prefix: '/my-custom/pdf' } });
	//...
};

init();
```
