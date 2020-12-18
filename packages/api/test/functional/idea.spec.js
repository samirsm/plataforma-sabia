const { trait, test } = use('Test/Suite')('Idea');

const Idea = use('App/Models/Idea');
const Taxonomy = use('App/Models/Taxonomy');
const Factory = use('Factory');
const { errorPayload, errors, antl } = require('../../app/Utils');
const { createUser } = require('../utils/Suts');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

test('GET /ideas returns all ideas', async ({ client }) => {
	const response = await client.get('/ideas').end();
	const ideas = await Idea.query()
		.limit(10)
		.fetch();

	response.assertStatus(200);
	response.assertJSONSubset(ideas.toJSON());
});

test('GET /ideas/:id returns an idea', async ({ client }) => {
	const user = await Factory.model('App/Models/User').create();
	const idea = await Factory.model('App/Models/Idea').create();
	await idea.user().associate(user);

	const response = await client.get(`/ideas/${idea.id}`).end();

	response.assertStatus(200);
	response.assertJSONSubset(idea.toJSON());
});

test('POST /ideas creates a new idea', async ({ client, assert }) => {
	const { user } = await createUser({ append: { status: 'verified' } });
	const keywordTaxonomy = await Taxonomy.getTaxonomy('KEYWORDS');
	const keywordTerms = await Factory.model('App/Models/Term').createMany(5);
	await keywordTaxonomy.terms().saveMany(keywordTerms);
	const keywordTermsIds = keywordTerms.map((keyword) => keyword.id);

	const response = await client
		.post('/ideas')
		.loginVia(user, 'jwt')
		.send({
			title: 'wonderfull idea',
			description: 'wonderfull idea description',
			keywords: keywordTermsIds,
		})
		.end();

	const ideaCreated = await Idea.findOrFail(response.body.id);

	response.assertStatus(200);
	assert.equal(ideaCreated.user_id, user.id);
	response.assertJSONSubset({ ...ideaCreated.toJSON(), ...keywordTerms.rows });
});

test('PUT /ideas/:id returns an error if the user is not authorized', async ({ client }) => {
	const { user } = await createUser({ append: { status: 'verified' } });

	const keywordTaxonomy = await Taxonomy.getTaxonomy('KEYWORDS');

	const oldKeywordTerms = await Factory.model('App/Models/Term').createMany(5);
	await keywordTaxonomy.terms().saveMany(oldKeywordTerms);
	const oldKeywordTermsIds = oldKeywordTerms.map((keyword) => keyword.id);

	const idea = await Factory.model('App/Models/Idea').create();
	await idea.terms().attach(oldKeywordTermsIds);

	const newKeywordTerms = await Factory.model('App/Models/Term').createMany(5);
	await keywordTaxonomy.terms().saveMany(newKeywordTerms);
	const newKeywordTermsIds = newKeywordTerms.map((keyword) => keyword.id);

	const response = await client
		.put(`/ideas/${idea.id}`)
		.loginVia(user, 'jwt')
		.send({
			title: 'wonderfull idea updated',
			description: 'wonderfull idea description updated',
			keywords: newKeywordTermsIds,
		})
		.end();

	response.assertStatus(403);
	response.assertJSONSubset(
		errorPayload(errors.UNAUTHORIZED_ACCESS, antl('error.permission.unauthorizedAccess')),
	);
});

test('PUT /ideas/:id updates an idea', async ({ client, assert }) => {
	const { user } = await createUser({ append: { status: 'verified' } });

	const keywordTaxonomy = await Taxonomy.getTaxonomy('KEYWORDS');

	const oldKeywordTerms = await Factory.model('App/Models/Term').createMany(5);
	await keywordTaxonomy.terms().saveMany(oldKeywordTerms);
	const oldKeywordTermsIds = oldKeywordTerms.map((keyword) => keyword.id);

	const idea = await Factory.model('App/Models/Idea').create();
	await idea.terms().attach(oldKeywordTermsIds);
	await idea.user().associate(user);

	const newKeywordTerms = await Factory.model('App/Models/Term').createMany(5);
	await keywordTaxonomy.terms().saveMany(newKeywordTerms);
	const newKeywordTermsIds = newKeywordTerms.map((keyword) => keyword.id);

	const response = await client
		.put(`/ideas/${idea.id}`)
		.loginVia(user, 'jwt')
		.send({
			title: 'wonderfull idea updated',
			description: 'wonderfull idea description updated',
			keywords: newKeywordTermsIds,
		})
		.end();

	const ideaUpdated = await Idea.findOrFail(response.body.id);

	response.assertStatus(200);
	assert.equal(ideaUpdated.title, 'wonderfull idea updated');
	assert.equal(ideaUpdated.description, 'wonderfull idea description updated');
	response.assertJSONSubset({ ...ideaUpdated.toJSON(), ...newKeywordTerms.rows });
});

test('DELETE /ideas/:id returns an error if the user is not authorized', async ({ client }) => {
	const { user } = await createUser({ append: { status: 'verified' } });
	const idea = await Factory.model('App/Models/Idea').create();

	const response = await client
		.delete(`/ideas/${idea.id}`)
		.loginVia(user, 'jwt')
		.end();

	response.assertStatus(403);
	response.assertJSONSubset(
		errorPayload(errors.UNAUTHORIZED_ACCESS, antl('error.permission.unauthorizedAccess')),
	);
});

test('DELETE /ideas/:id deletes an idea', async ({ client, assert }) => {
	const { user } = await createUser({ append: { status: 'verified' } });
	const idea = await Factory.model('App/Models/Idea').create();
	await idea.user().associate(user);

	const response = await client
		.delete(`/ideas/${idea.id}`)
		.loginVia(user, 'jwt')
		.end();

	response.assertStatus(200);

	const ideaFromDatabase = await Idea.query()
		.where({ id: idea.id })
		.first();

	assert.isNull(ideaFromDatabase);
});