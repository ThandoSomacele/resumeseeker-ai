import { writable } from 'svelte/store';
import type { ToastMessage } from '$lib/types';
import { generateId } from '$lib/utils/helpers';

function createToastStore() {
	const { subscribe, update } = writable<ToastMessage[]>([]);

	function addToast(
		type: ToastMessage['type'],
		message: string,
		duration: number = 5000
	) {
		const id = generateId();
		const toast: ToastMessage = { id, type, message, duration };

		update((toasts) => [...toasts, toast]);

		if (duration > 0) {
			setTimeout(() => {
				removeToast(id);
			}, duration);
		}

		return id;
	}

	function removeToast(id: string) {
		update((toasts) => toasts.filter((t) => t.id !== id));
	}

	return {
		subscribe,
		success: (message: string, duration?: number) =>
			addToast('success', message, duration),
		error: (message: string, duration?: number) =>
			addToast('error', message, duration),
		info: (message: string, duration?: number) =>
			addToast('info', message, duration),
		warning: (message: string, duration?: number) =>
			addToast('warning', message, duration),
		remove: removeToast,
		clear: () => update(() => []),
	};
}

export const toastStore = createToastStore();
