/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Role = use('App/Models/Role');

/**
 * Resourceful controller for interacting with roles
 */
class RoleController {
	/**
	 * Show a list of all roles.
	 * GET roles
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */

	async index() {
		return Role.all();
	}

	/**
	 * Render a form to be used for creating a new role.
	 * GET roles/create
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */

	/** 
		async create({ request }) {
	 
		}
	 */
	/**
	 * Create/save a new role.
	 * POST roles
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */

	async store({ request }) {
		const { role, description } = request.all();

		return Role.create({ role, description });
	}

	/**
	 * Display a single role.
	 * GET roles/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */

	async show({ params }) {
		const { id } = params;
		return Role.find(id);
	}

	/**
	 * Render a form to update an existing role.
	 * GET roles/:id/edit
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	/*
  async edit({ params, request, response, view }) {}
*/
	/**
	 * Update role details.
	 * PUT or PATCH roles/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */

	async update({ params, request }) {
		const { id } = params;
		const upRole = await Role.find(id);
		const { role, description } = request.all();
		upRole.fill({ role, description });
		return upRole.save();
	}

	/**
	 * Delete a role with id.
	 * DELETE roles/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */

	async destroy({ params }) {
		const { id } = params;
		const role = await Role.find(id);
		await role.delete();
	}
}

module.exports = RoleController;
