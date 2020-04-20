/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const User = use('App/Models/User');
const Role = use('App/Models/Role');
const Antl = use('Antl');

class AuthController {
	/**
	 * Register an user.
	 *
	 * @param {object} ctx The content of the request
	 * @param {Request} ctx.request The HTTP request
	 *
	 * @returns {Response}
	 */
	async register({ request, response }) {
		const data = request.only(['username', 'email', 'password']);

		const defaultUserRole = await Role.getDefaultUserRole();

		if (!defaultUserRole) {
			return response.status(400).send({
				error: {
					message: Antl.formatMessage('messages.defaultUserRoleDoesntExist'),
				},
			});
		}

		const user = await User.create(data);
		await user.role().associate(defaultUserRole);
		await user.load('role');
		return {
			...user.toJSON(),
			password: '',
		};
	}

	/**
	 * Register an user.
	 *
	 * @param {object} ctx The content of the request
	 * @param {Request} ctx.request The HTTP request
	 * @param {object} ctx.auth The Auth object.
	 *
	 * @returns {Response}
	 */
	auth({ request, auth }) {
		const { email, password } = request.all();

		return auth.attempt(email, password);
	}
}

module.exports = AuthController;
