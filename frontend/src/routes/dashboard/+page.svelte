<script lang="ts">
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/auth';
	import { api } from '$lib/utils/api';
	import { toastStore } from '$lib/stores/toast';
	import type { UserStats } from '$lib/types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let stats = $state<UserStats | null>(null);
	let isLoading = $state(true);

	onMount(async () => {
		try {
			stats = await api.getUserStats();
		} catch (error: any) {
			toastStore.error('Failed to load stats');
		} finally {
			isLoading = false;
		}
	});
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900">
			Welcome back{$user?.full_name ? `, ${$user.full_name}` : ''}!
		</h1>
		<p class="text-gray-600 mt-2">Here's what's happening with your job search</p>
	</div>

	{#if isLoading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			{#each [1, 2, 3, 4] as _}
				<Card>
					{#snippet children()}
						<div class="animate-pulse">
							<div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
							<div class="h-8 bg-gray-200 rounded w-1/3"></div>
						</div>
					{/snippet}
				</Card>
			{/each}
		</div>
	{:else if stats}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<Card hover>
				{#snippet children()}
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Total Resumes</p>
							<p class="text-3xl font-bold text-gray-900 mt-2">{stats.total_resumes}</p>
						</div>
						<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
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
					</div>
				{/snippet}
			</Card>

			<Card hover>
				{#snippet children()}
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Job Matches</p>
							<p class="text-3xl font-bold text-gray-900 mt-2">{stats.total_matches}</p>
						</div>
						<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
							<svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</div>
				{/snippet}
			</Card>

			<Card hover>
				{#snippet children()}
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Saved Jobs</p>
							<p class="text-3xl font-bold text-gray-900 mt-2">{stats.saved_jobs}</p>
						</div>
						<div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
							<svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
								<path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
							</svg>
						</div>
					</div>
				{/snippet}
			</Card>

			<Card hover>
				{#snippet children()}
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Applications</p>
							<p class="text-3xl font-bold text-gray-900 mt-2">{stats.applied_jobs}</p>
						</div>
						<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
							<svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</div>
				{/snippet}
			</Card>
		</div>
	{/if}

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<Card>
			{#snippet children()}
				<h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
				<div class="space-y-3">
					{#if stats?.total_resumes === 0}
						<a
							href="/resumes/upload"
							class="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
						>
							<div class="flex items-center space-x-3">
								<div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
									<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
								<div>
									<p class="font-medium text-gray-900">Upload Your Resume</p>
									<p class="text-sm text-gray-600">Get started by uploading your CV</p>
								</div>
							</div>
							<svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					{:else}
						<a
							href="/jobs"
							class="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
						>
							<div class="flex items-center space-x-3">
								<div class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
									<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
										<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
										<path
											fill-rule="evenodd"
											d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
								<div>
									<p class="font-medium text-gray-900">Browse Job Matches</p>
									<p class="text-sm text-gray-600">
										{stats?.total_matches || 0} jobs waiting for you
									</p>
								</div>
							</div>
							<svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					{/if}

					<a
						href="/resumes"
						class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
					>
						<div class="flex items-center space-x-3">
							<div class="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
								<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
							<div>
								<p class="font-medium text-gray-900">Manage Resumes</p>
								<p class="text-sm text-gray-600">View and edit your resumes</p>
							</div>
						</div>
						<svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
				</div>
			{/snippet}
		</Card>

		<Card>
			{#snippet children()}
				<h2 class="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
				<div class="space-y-4">
					<div class="flex items-start space-x-3">
						<div
							class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 {stats?.total_resumes
								? 'bg-green-100 text-green-600'
								: 'bg-gray-200 text-gray-600'}"
						>
							{#if stats?.total_resumes}
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
							{:else}
								<span class="font-semibold">1</span>
							{/if}
						</div>
						<div>
							<p class="font-medium text-gray-900">Upload your resume</p>
							<p class="text-sm text-gray-600 mt-1">
								We'll extract your skills and experience automatically
							</p>
						</div>
					</div>

					<div class="flex items-start space-x-3">
						<div
							class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200 text-gray-600"
						>
							<span class="font-semibold">2</span>
						</div>
						<div>
							<p class="font-medium text-gray-900">Review your matches</p>
							<p class="text-sm text-gray-600 mt-1">
								Browse AI-powered job recommendations tailored for you
							</p>
						</div>
					</div>

					<div class="flex items-start space-x-3">
						<div
							class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200 text-gray-600"
						>
							<span class="font-semibold">3</span>
						</div>
						<div>
							<p class="font-medium text-gray-900">Apply to jobs</p>
							<p class="text-sm text-gray-600 mt-1">
								Save favorites and track your applications
							</p>
						</div>
					</div>
				</div>
			{/snippet}
		</Card>
	</div>
</div>
