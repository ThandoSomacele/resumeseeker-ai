<script lang="ts">
	import { authStore, user } from '$lib/stores/auth';
	import { toastStore } from '$lib/stores/toast';
	import { goto } from '$app/navigation';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	let isMenuOpen = $state(false);

	function handleLogout() {
		authStore.logout();
		toastStore.success('Logged out successfully');
		goto('/login');
	}

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<nav class="bg-white shadow-md {className}">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<div class="flex items-center">
				<a href="/" class="flex items-center space-x-2">
					<svg
						class="w-8 h-8 text-blue-600"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
						/>
						<path
							fill-rule="evenodd"
							d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
							clip-rule="evenodd"
						/>
					</svg>
					<span class="text-xl font-bold text-gray-900">ResumeSeeker</span>
					<span class="text-xs text-gray-500 italic">The Job Finds You</span>
				</a>
			</div>

			{#if $user}
				<div class="hidden md:flex items-center space-x-4">
					<a
						href="/dashboard"
						class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
					>
						Dashboard
					</a>
					<a
						href="/jobs"
						class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
					>
						Jobs
					</a>
					<a
						href="/resumes"
						class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
					>
						My Resumes
					</a>

					<div class="flex items-center space-x-3 pl-4 border-l border-gray-200">
						<span class="text-sm text-gray-700">{$user.email}</span>
						<button
							type="button"
							class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
							onclick={handleLogout}
						>
							Logout
						</button>
					</div>
				</div>

				<div class="md:hidden flex items-center">
					<button
						type="button"
						class="text-gray-700 hover:text-blue-600 p-2"
						onclick={toggleMenu}
						aria-label="Toggle menu"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							{#if isMenuOpen}
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							{:else}
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							{/if}
						</svg>
					</button>
				</div>
			{:else}
				<div class="flex items-center space-x-4">
					<a
						href="/login"
						class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
					>
						Login
					</a>
					<a
						href="/register"
						class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
					>
						Get Started
					</a>
				</div>
			{/if}
		</div>
	</div>

	{#if isMenuOpen && $user}
		<div class="md:hidden border-t border-gray-200">
			<div class="px-2 pt-2 pb-3 space-y-1">
				<a
					href="/dashboard"
					class="block text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
				>
					Dashboard
				</a>
				<a
					href="/jobs"
					class="block text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
				>
					Jobs
				</a>
				<a
					href="/resumes"
					class="block text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
				>
					My Resumes
				</a>
				<div class="pt-2 border-t border-gray-200">
					<p class="px-3 py-2 text-sm text-gray-700">{$user.email}</p>
					<button
						type="button"
						class="w-full text-left text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
						onclick={handleLogout}
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	{/if}
</nav>
