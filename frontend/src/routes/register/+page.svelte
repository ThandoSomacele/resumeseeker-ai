<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { toastStore } from '$lib/stores/toast';
	import { api } from '$lib/utils/api';
	import { isValidEmail, isValidPassword } from '$lib/utils/helpers';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let fullName = $state('');
	let errors = $state<{
		email?: string;
		password?: string;
		confirmPassword?: string;
		fullName?: string;
	}>({});
	let isLoading = $state(false);

	function validateForm(): boolean {
		const newErrors: typeof errors = {};

		if (!fullName.trim()) {
			newErrors.fullName = 'Full name is required';
		}

		if (!email) {
			newErrors.email = 'Email is required';
		} else if (!isValidEmail(email)) {
			newErrors.email = 'Invalid email address';
		}

		if (!password) {
			newErrors.password = 'Password is required';
		} else if (!isValidPassword(password)) {
			newErrors.password = 'Password must be at least 8 characters';
		}

		if (!confirmPassword) {
			newErrors.confirmPassword = 'Please confirm your password';
		} else if (password !== confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit() {
		if (!validateForm()) return;

		isLoading = true;
		try {
			const response = await api.register({
				email,
				password,
				full_name: fullName
			});
			authStore.setUser(response.user);
			toastStore.success('Account created successfully! Welcome to ResumeSeeker.');
			goto('/dashboard');
		} catch (error: any) {
			if (error.detail?.includes('already registered')) {
				toastStore.error('An account with this email already exists');
			} else {
				toastStore.error(error.detail || 'Failed to create account');
			}
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
	<div class="w-full max-w-md">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
			<p class="text-gray-600">Start finding your perfect job today</p>
		</div>

		<Card>
			{#snippet children()}
				<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
					<div class="space-y-4">
						<Input
							type="text"
							label="Full Name"
							bind:value={fullName}
							error={errors.fullName}
							placeholder="John Doe"
							required
							disabled={isLoading}
						/>

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

						<Input
							type="password"
							label="Confirm Password"
							bind:value={confirmPassword}
							error={errors.confirmPassword}
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
								{isLoading ? 'Creating account...' : 'Create Account'}
							{/snippet}
						</Button>
					</div>
				</form>

				<div class="mt-6 text-center">
					<p class="text-sm text-gray-600">
						Already have an account?
						<a href="/login" class="text-blue-600 hover:text-blue-700 font-medium">
							Sign in
						</a>
					</p>
				</div>

				<div class="mt-4 text-center">
					<p class="text-xs text-gray-500">
						By creating an account, you agree to our Terms of Service and Privacy Policy
					</p>
				</div>
			{/snippet}
		</Card>
	</div>
</div>
