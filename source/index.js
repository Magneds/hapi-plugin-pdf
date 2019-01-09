const Puppeteer = require('puppeteer');
const Plugin = require('@magneds/hapi-plugin');
const plugin = new Plugin(require('../package.json'));

function serialize(obj) {
	return Object.keys(obj)
		.map(
			(key) =>
				`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
		)
		.join('&');
}

plugin.name = 'pdf';
plugin.prefix = '/pdf';
plugin.register = async (server) => {
	const browser = await Puppeteer.launch();

	server.route([
		{
			method: ['GET', 'POST'],
			path: '/render',
			async handler(request, h) {
				const { method, query, payload, headers } = request;
				const page = await browser.newPage();
				const url = (payload || {}).url || query.url;

				if (method === 'post') {
					await page.setRequestInterception(true);

					page.on('request', (request) => {
						const override = {
							headers: {
								...headers,
								'accept-encoding': undefined,
								'content-length': undefined
							}
						};

						if (request.url() === url) {
							override.method = 'POST';
							override.postData = serialize(payload);
						}

						return request.continue(override);
					});
				}

				await page.goto(url, {
					waitUntil: 'load'
				});
				const pdf = await page.pdf({
					format: 'A4',
					printBackground: true
				});

				await page.close();

				return h
					.response(pdf)
					.header('content-type', 'application/pdf');
			}
		}
	]);
};

module.exports = plugin.exports;
