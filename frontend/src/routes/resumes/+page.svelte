<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/utils/api';
	import { toastStore } from '$lib/stores/toast';
	import type { Resume } from '$lib/types';
	import { formatDate } from '$lib/utils/helpers';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';

	let resumes = $state<Resume[]>([]);
	let isLoading = $state(true);
	let deleteModalOpen = $state(false);
	let resumeToDelete = $state<Resume | null>(null);
	let isDeleting = $state(false);

	onMount(async () => {
		await loadResumes();
	});

	async function loadResumes() {
		isLoading = true;
		try {
			resumes = await api.getResumes();
		} catch (error: any) {
			toastStore.error('Failed to load resumes');
		} finally {
			isLoading = false;
		}
	}

	function openDeleteModal(resume: Resume) {
		resumeToDelete = resume;
		deleteModalOpen = true;
	}

	async function handleDelete() {
		if (!resumeToDelete) return;

		isDeleting = true;
		try {
			await api.deleteResume(resumeToDelete.id);
			toastStore.success('Resume deleted successfully');
			deleteModalOpen = false;
			await loadResumes();
		} catch (error: any) {
			toastStore.error('Failed to delete resume');
		} finally {
			isDeleting = false;
		}
	}
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="flex justify-between items-center mb-8">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">My Resumes</h1>
			<p class="text-gray-600 mt-2">Manage your uploaded resumes</p>
		</div>
		<Button variant="primary" onclick={() => goto('/resumes/upload')}>
			{#snippet children()}
				<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
						clip-rule="evenodd"
					/>
				</svg>
				Upload Resume
			{/snippet}
		</Button>
	</div>

	{#if isLoading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each [1, 2, 3] as _}
				<Card>
					{#snippet children()}
						<div class="animate-pulse space-y-4">
							<div class="h-4 bg-gray-200 rounded w-3/4"></div>
							<div class="h-3 bg-gray-200 rounded w-1/2"></div>
							<div class="h-8 bg-gray-200 rounded"></div>
						</div>
					{/snippet}
				</Card>
			{/each}
		</div>
	{:else if resumes.length === 0}
		<Card>
			{#snippet children()}
				<div class="text-center py-12">
					<svg
						class="mx-auto h-12 w-12 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					<h3 class="mt-2 text-lg font-medium text-gray-900">No resumes yet</h3>
					<p class="mt-1 text-sm text-gray-500">
						Get started by uploading your first resume
					</p>
					<div class="mt-6">
						<Button variant="primary" onclick={() => goto('/resumes/upload')}>
							{#snippet children()}
								Upload Resume
							{/snippet}
						</Button>
					</div>
				</div>
			{/snippet}
		</Card>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each resumes as resume}
				<Card hover>
					{#snippet children()}
						<div class="space-y-4">
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<h3 class="font-semibold text-gray-900 truncate">
										{resume.original_filename}
									</h3>
									<p class="text-sm text-gray-500 mt-1">
										Uploaded {formatDate(resume.created_at)}
									</p>
								</div>
								<button
									type="button"
									onclick={(e) => {
										e.stopPropagation();
										openDeleteModal(resume);
									}}
									class="text-gray-400 hover:text-red-600 transition-colors"
									aria-label="Delete resume"
								>
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
											clip-rule="evenodd"
										/>
									</svg>
								</button>
							</div>

							{#if resume.parsed_data}
								<div class="space-y-2">
									{#if resume.parsed_data.skills && resume.parsed_data.skills.length > 0}
										<div>
											<p class="text-xs font-medium text-gray-500 mb-1">Skills</p>
											<div class="flex flex-wrap gap-1">
												{#each resume.parsed_data.skills.slice(0, 3) as skill}
													<span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
														{skill}
													</span>
												{/each}
												{#if resume.parsed_data.skills.length > 3}
													<span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
														+{resume.parsed_data.skills.length - 3} more
													</span>
												{/if}
											</div>
										</div>
									{/if}

									{#if resume.parsed_data.experience && resume.parsed_data.experience.length > 0}
										<div>
											<p class="text-xs font-medium text-gray-500">
												{resume.parsed_data.experience.length} work experience{resume.parsed_data
													.experience.length !== 1
													? 's'
													: ''}
											</p>
										</div>
									{/if}

									{#if resume.parsed_data.education && resume.parsed_data.education.length > 0}
										<div>
											<p class="text-xs font-medium text-gray-500">
												{resume.parsed_data.education.length} education entr{resume.parsed_data
													.education.length !== 1
													? 'ies'
													: 'y'}
											</p>
										</div>
									{/if}
								</div>
							{/if}

							<Button
								variant="outline"
								class="w-full"
								onclick={() => goto(`/resumes/${resume.id}`)}
							>
								{#snippet children()}
									View Details
								{/snippet}
							</Button>
						</div>
					{/snippet}
				</Card>
			{/each}
		</div>
	{/if}
</div>

<!-- Delete Confirmation Modal -->
<Modal bind:isOpen={deleteModalOpen} title="Delete Resume">
	{#snippet children()}
		<p class="text-gray-600">
			Are you sure you want to delete <strong>{resumeToDelete?.original_filename}</strong>?
			This action cannot be undone.
		</p>
	{/snippet}
	{#snippet footer()}
		<div class="flex justify-end space-x-3">
			<Button variant="outline" onclick={() => (deleteModalOpen = false)} disabled={isDeleting}>
				{#snippet children()}
					Cancel
				{/snippet}
			</Button>
			<Button variant="danger" onclick={handleDelete} disabled={isDeleting}>
				{#snippet children()}
					{isDeleting ? 'Deleting...' : 'Delete'}
				{/snippet}
			</Button>
		</div>
	{/snippet}
</Modal>
