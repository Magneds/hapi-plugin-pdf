const Hapi = require('@hapi/hapi');
const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { experiment, beforeEach, test } = (exports.lab = Lab.script());

const HapiPluginPDF = require('../..');

async function start(...plugins) {
	const server = Hapi.server();

	const init = async () => {
		await server.register(plugins);
		await server.start();
	};

	await init();

	return server;
}

experiment('Hapi', () => {
	experiment('default registration', () => {
		test('GET request', { timeout: 10000 }, async () => {
			const server = await start(HapiPluginPDF);
			const url = encodeURIComponent(
				'https://postman-echo.com/get?foo=bar&baz=qux'
			);
			const get = await server.inject({
				method: 'GET',
				url: `/pdf/render?url=${url}`
			});

			expect(get).to.be.object();
			expect(get.statusCode).to.equal(200);
			expect(get.headers).to.contain('content-type');
			expect(get.headers['content-type']).to.equal('application/pdf');
		});

		test('POST request', { timeout: 10000 }, async () => {
			const server = await start(HapiPluginPDF);
			const post = await server.inject({
				method: 'POST',
				url: '/pdf/render',
				payload: {
					url: 'https://postman-echo.com/post',
					foo: 'bar',
					baz: 'qux'
				}
			});

			expect(post).to.be.object();
			expect(post.statusCode).to.equal(200);
			expect(post.headers).to.contain('content-type');
			expect(post.headers['content-type']).to.equal('application/pdf');
		});

		test('POST content', { timeout: 10000 }, async () => {
			const server = await start(HapiPluginPDF);
			const post = await server.inject({
				method: 'POST',
				url: '/pdf/render/content',
				payload: {
					content: 'content',
					foo: 'bar',
					baz: 'qux'
				}
			});

			expect(post).to.be.object();
			expect(post.statusCode).to.equal(200);
			expect(post.headers).to.contain('content-type');
			expect(post.headers['content-type']).to.equal('application/pdf');
		});
	});

	experiment('path prefix override', () => {
		test('GET request', { timeout: 10000 }, async () => {
			const server = await start({
				...HapiPluginPDF,
				routes: { prefix: '/override/path' }
			});
			const url = encodeURIComponent(
				'https://postman-echo.com/get?foo=bar&baz=qux'
			);
			const get = await server.inject({
				method: 'GET',
				url: `/override/path/render?url=${url}`
			});

			expect(get).to.be.object();
			expect(get.statusCode).to.equal(200);
			expect(get.headers).to.contain('content-type');
			expect(get.headers['content-type']).to.equal('application/pdf');
		});

		test('POST request', { timeout: 10000 }, async () => {
			const server = await start({
				...HapiPluginPDF,
				routes: { prefix: '/override/path' }
			});
			const post = await server.inject({
				method: 'POST',
				url: '/override/path/render',
				payload: {
					url: 'https://postman-echo.com/post',
					foo: 'bar',
					baz: 'qux'
				}
			});

			expect(post).to.be.object();
			expect(post.statusCode).to.equal(200);
			expect(post.headers).to.contain('content-type');
			expect(post.headers['content-type']).to.equal('application/pdf');
		});

		test('POST content', { timeout: 10000 }, async () => {
			const server = await start({
				...HapiPluginPDF,
				routes: { prefix: '/override/path' }
			});
			const post = await server.inject({
				method: 'POST',
				url: '/override/path/render/content',
				payload: {
					content: 'content',
					foo: 'bar',
					baz: 'qux'
				}
			});

			expect(post).to.be.object();
			expect(post.statusCode).to.equal(200);
			expect(post.headers).to.contain('content-type');
			expect(post.headers['content-type']).to.equal('application/pdf');
		});
	});
});
