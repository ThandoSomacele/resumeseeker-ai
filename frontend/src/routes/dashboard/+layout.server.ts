import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const token = cookies.get('auth_token');

	if (!token) {
		throw redirect(307, '/login');
	}

	return {};
};
