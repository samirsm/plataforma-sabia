const { test, trait } = use('Test/Suite')('Technology');

trait('Test/ApiClient');
trait('DatabaseTransactions');

const { antl, errors, errorPayload } = require('../../app/Utils');

const Technology = use('App/Models/Technology');

const technology = {
	title: 'TEST_TITLE',
	description: 'TEST_DESCRIPTION',
	logo: 'TEST_LOGO',
	site_url: 'TEST_URL_SITE',
	private: 1,
	category: 'TEST_CATEGORY',
	price: 105.7,
	place: 'TEST_PLACE',
	likes: 10,
	weeks: 10,
	region: 'TEST_REGION',
};

const updatedTechnology = {
	title: 'UPDATED_TITLE',
	description: 'UPDATED_DESCRIPTION',
	logo: 'UPDATED_LOGO',
	private: 1,
	category: 'UPDATED_CATEGORY',
	price: 20.5,
	place: 'UPDATED_PLACE',
	likes: 20,
	weeks: 20,
	region: 'UPDATED_REGION',
};

const invalidField = {
	invalid_field: 'Invalid field',
};

test('GET /technologies get list of technologies', async ({ client }) => {
	await Technology.create(technology);

	const response = await client.get('/technologies').end();

	response.assertStatus(200);
	response.assertJSONSubset([technology]);
});

test('GET /technologies fails with an inexistent technology', async ({ client }) => {
	const response = await client.get('/technologies/12312').end();

	response.assertStatus(400);
});

test('GET /technologies/:id returns a single technology', async ({ client }) => {
	const newTechnology = await Technology.create(technology);

	const response = await client.get(`/technologies/${newTechnology.id}`).end();

	response.assertStatus(200);
	response.assertJSONSubset(newTechnology.toJSON());
});

test('POST /technologies creates/saves a new technology.', async ({ client }) => {
	const response = await client
		.post('/technologies')
		.send(technology)
		.end();

	const technologyCreated = await Technology.find(response.body.id);

	response.assertStatus(200);
	response.assertJSONSubset(technologyCreated.toJSON());
});

test('POST /technologies creates/saves a new technology even if an invalid field is provided.', async ({
	client,
}) => {
	const invalidTechnology = { ...technology, ...invalidField };
	const response = await client
		.post('/technologies')
		.send(invalidTechnology)
		.end();

	const technologyCreated = await Technology.find(response.body.id);

	response.assertStatus(200);
	response.assertJSONSubset(technologyCreated.toJSON());
});

test('PUT /technologies/:id Updates technology details', async ({ client }) => {
	const newTechnology = await Technology.create(technology);

	const response = await client
		.put(`/technologies/${newTechnology.id}`)
		.send(updatedTechnology)
		.end();

	response.assertStatus(200);
	response.assertJSONSubset(updatedTechnology);
});

test('PUT /technologies/:id Updates technology details even if an invalid field is provided.', async ({
	client,
}) => {
	const newTechnology = await Technology.create(technology);

	const invalidUpdatedTechnology = { ...updatedTechnology, ...invalidField };

	const response = await client
		.put(`/technologies/${newTechnology.id}`)
		.send(invalidUpdatedTechnology)
		.end();

	response.assertStatus(200);
	response.assertJSONSubset(updatedTechnology);
});

test('DELETE /technologies/:id Fails if an inexistent technology is provided.', async ({
	client,
}) => {
	const response = await client.delete(`/technologies/999`).end();

	response.assertStatus(400);
	response.assertJSONSubset(
		errorPayload(errors.RESOURCE_NOT_FOUND, antl('error.resource.resourceNotFound')),
	);
});

test('DELETE /technologies/:id Delete a technology with id.', async ({ client }) => {
	const newTechnology = await Technology.create(technology);

	const response = await client.delete(`/technologies/${newTechnology.id}`).end();

	response.assertStatus(200);
	response.assertJSONSubset({
		success: true,
	});
});