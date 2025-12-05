<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { toastStore } from '$lib/stores/toast';
	import { api } from '$lib/utils/api';
	import { isValidEmail } from '$lib/utils/helpers';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let email = $state('');
	let password = $state('');
	let errors = $state<{ email?: string; password?: string }>({});
	let isLoading = $state(false);

	function validateForm(): boolean {
		const newErrors: typeof errors = {};

		if (!email) {
			newErrors.email = 'Email is required';
		} else if (!isValidEmail(email)) {
			newErrors.email = 'Invalid email address';
		}

		if (!password) {
			newErrors.password = 'Password is required';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit() {
		if (!validateForm()) return;

		isLoading = true;
		try {
			const response = await api.login({ email, password });
			authStore.setUser(response.user);
			toastStore.success('Welcome back!');
			goto('/dashboard');
		} catch (error: any) {
			toastStore.error(error.detail || 'Invalid email or password');
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
	<div class="w-full max-w-md">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
			<p class="text-gray-600">Sign in to your ResumeSeeker account</p>
		</div>

		<Card>
			{#snippet children()}
				<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
					<div class="space-y-4">
						<Input
							type="email"
							label="Email"
							bind:value={email}
							error={errors.email}
							placeholder="you@example.com"
							required
							disabled={isLoading}
						/>

						<Input
							type="password"
							label="Password"
							bind:value={password}
							error={errors.password}
							placeholder="••••••••"
							required
							disabled={isLoading}
						/>

						<Button
							type="submit"
							variant="primary"
							class="w-full"
							disabled={isLoading}
						>
							{#snippet children()}
								{isLoading ? 'Signing in...' : 'Sign In'}
							{/snippet}
						</Button>
					</div>
				</form>

				<div class="mt-6 text-center">
					<p class="text-sm text-gray-600">
						Don't have an account?
						<a href="/register" class="text-blue-600 hover:text-blue-700 font-medium">
							Sign up
						</a>
					</p>
				</div>
			{/snippet}
		</Card>
	</div>
</div>
