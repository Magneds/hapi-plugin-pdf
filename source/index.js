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
plugin.register = (server) =>
	server.route([
		{
			method: ['GET', 'POST'],
			path: '/render',
			async handler(request, h) {
				const { method, query, payload, headers } = request;
				const browser = await Puppeteer.launch();
				const page = await browser.newPage();
				const url = (payload || {}).url || query.url;
				const param = serialize(query);

				if (method === 'post') {
					await page.setRequestInterception(true);

					page.on('request', (request) => {
						const override = {
							method: 'POST',
							postData: serialize(payload),
							headers: {
								...headers,
								'accept-encoding': undefined,
								'content-length': undefined
							}
						};

						return request.continue(override);
					});
				}

				await page.goto(url + (param ? `?${param}` : ''), {
					waitUntil: 'load'
				});
				const pdf = await page.pdf({
					format: 'A4',
					printBackground: true
				});

				return h
					.response(pdf)
					.header('content-type', 'application/pdf');
			}
		}
	]);

module.exports = plugin.export;
