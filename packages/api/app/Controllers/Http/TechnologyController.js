/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const Technology = use('App/Models/Technology');

// get only useful fields
const getFields = (request) =>
	request.only([
		'title',
		'description',
		'logo',
		'site_url',
		'private',
		'category',
		'price',
		'place',
		'likes',
		'weeks',
		'region',
	]);

class TechnologyController {
	async index() {
		const technologies = Technology.all();

		return technologies;
	}

	async show({ params }) {
		return Technology.findOrFail(params.id);
	}

	async destroy({ params, response }) {
		const technology = await Technology.findOrFail(params.id);

		await technology.delete();
		return response.status(200).send({ success: true });
	}

	async store({ request }) {
		const data = getFields(request);

		try {
			return Technology.create(data);
		} catch (error) {
			return error;
		}
	}

	async update({ params, request }) {
		const technology = await Technology.findOrFail(params.id);

		const data = getFields(request);

		technology.merge(data);

		await technology.save();
		return technology;
	}
}

module.exports = TechnologyController;