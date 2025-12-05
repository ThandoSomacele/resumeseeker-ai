<script lang="ts">
	import { isAuthenticated } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';

	onMount(() => {
		if ($isAuthenticated) {
			goto('/dashboard');
		}
	});
</script>

<div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
	<div class="max-w-4xl mx-auto text-center">
		<div class="mb-8">
			<h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
				ResumeSeeker<span class="text-blue-600">.ai</span>
			</h1>
			<p class="text-2xl md:text-3xl text-gray-600 mb-6 italic">
				"The Job Finds You"
			</p>
		</div>

		<div class="mb-12">
			<p class="text-xl text-gray-700 mb-6">
				Stop searching for jobs. Let AI find the perfect opportunities for you.
			</p>
			<p class="text-lg text-gray-600 mb-8">
				Upload your resume once, and our intelligent matching system continuously discovers
				jobs that fit your skills, experience, and career goals.
			</p>
		</div>

		<div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
			<Button
				variant="primary"
				size="lg"
				onclick={() => goto('/register')}
			>
				{#snippet children()}
					Get Started Free
				{/snippet}
			</Button>
			<Button
				variant="outline"
				size="lg"
				onclick={() => goto('/login')}
			>
				{#snippet children()}
					Sign In
				{/snippet}
			</Button>
		</div>

		<div class="grid md:grid-cols-3 gap-8 text-left">
			<div class="bg-white p-6 rounded-lg shadow-md">
				<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
					<svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
						/>
						<path
							fill-rule="evenodd"
							d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">Smart Resume Parsing</h3>
				<p class="text-gray-600">
					AI extracts your skills, experience, and education automatically from your CV.
				</p>
			</div>

			<div class="bg-white p-6 rounded-lg shadow-md">
				<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
					<svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">AI-Powered Matching</h3>
				<p class="text-gray-600">
					Semantic search finds jobs that truly match your profile, not just keywords.
				</p>
			</div>

			<div class="bg-white p-6 rounded-lg shadow-md">
				<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
					<svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
						<path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">Personalized Feed</h3>
				<p class="text-gray-600">
					System learns from your preferences and improves recommendations over time.
				</p>
			</div>
		</div>
	</div>
</div>
