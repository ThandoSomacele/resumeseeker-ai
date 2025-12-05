import { writable, derived } from 'svelte/store';
import type { User } from '$lib/types';
import { api } from '$lib/utils/api';

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		isAuthenticated: false,
		isLoading: true,
	});

	return {
		subscribe,
		setUser: (user: User | null) => {
			update((state) => ({
				...state,
				user,
				isAuthenticated: !!user,
				isLoading: false,
			}));
		},
		setLoading: (isLoading: boolean) => {
			update((state) => ({ ...state, isLoading }));
		},
		logout: () => {
			api.logout();
			set({
				user: null,
				isAuthenticated: false,
				isLoading: false,
			});
		},
		initialize: async () => {
			const token = api.getToken();
			if (!token) {
				set({
					user: null,
					isAuthenticated: false,
					isLoading: false,
				});
				return;
			}

			try {
				const user = await api.getCurrentUser();
				update((state) => ({
					...state,
					user,
					isAuthenticated: true,
					isLoading: false,
				}));
			} catch (error) {
				// Token is invalid, clear it
				api.setToken(null);
				set({
					user: null,
					isAuthenticated: false,
					isLoading: false,
				});
			}
		},
	};
}

export const authStore = createAuthStore();

// Derived store for easy access to user
export const user = derived(authStore, ($auth) => $auth.user);

// Derived store for authentication status
export const isAuthenticated = derived(authStore, ($auth) => $auth.isAuthenticated);
