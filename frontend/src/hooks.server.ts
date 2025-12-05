import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('auth_token');
	const pathname = event.url.pathname;

	// Protected routes that require authentication
	const protectedRoutes = ['/dashboard', '/jobs', '/resumes', '/profile'];
	const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

	// Public routes that authenticated users shouldn't access
	const publicRoutes = ['/login', '/register'];
	const isPublicRoute = publicRoutes.includes(pathname);

	// Redirect authenticated users away from login/register
	if (token && isPublicRoute) {
		throw redirect(307, '/dashboard');
	}

	// Redirect unauthenticated users to login for protected routes
	if (!token && isProtectedRoute) {
		throw redirect(307, '/login');
	}

	const response = await resolve(event);
	return response;
};
