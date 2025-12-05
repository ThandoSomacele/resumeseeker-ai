<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { api } from '$lib/utils/api';
	import { toastStore } from '$lib/stores/toast';
	import type { Resume } from '$lib/types';
	import { formatDate } from '$lib/utils/helpers';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';

	let resume = $state<Resume | null>(null);
	let isLoading = $state(true);
	let isEditingSkills = $state(false);
	let skillsInput = $state('');
	let isSavingSkills = $state(false);

	onMount(async () => {
		const resumeId = $page.params.id;
		await loadResume(resumeId);
	});

	async function loadResume(id: string) {
		isLoading = true;
		try {
			resume = await api.getResume(id);
			if (resume.parsed_data?.skills) {
				skillsInput = resume.parsed_data.skills.join(', ');
			}
		} catch (error: any) {
			toastStore.error('Failed to load resume');
			goto('/resumes');
		} finally {
			isLoading = false;
		}
	}

	function startEditingSkills() {
		isEditingSkills = true;
	}

	async function saveSkills() {
		if (!resume) return;

		isSavingSkills = true;
		try {
			const skills = skillsInput.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
			const updated = await api.updateResumeSkills(resume.id, skills);
			resume = updated;
			isEditingSkills = false;
			toastStore.success('Skills updated successfully');
		} catch (error: any) {
			toastStore.error('Failed to update skills');
		} finally {
			isSavingSkills = false;
		}
	}

	function cancelEditingSkills() {
		if (resume?.parsed_data?.skills) {
			skillsInput = resume.parsed_data.skills.join(', ');
		}
		isEditingSkills = false;
	}
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="mb-6">
		<button
			type="button"
			onclick={() => goto('/resumes')}
			class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
		>
			<svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
					clip-rule="evenodd"
				/>
			</svg>
			Back to Resumes
		</button>
	</div>

	{#if isLoading}
		<Card>
			{#snippet children()}
				<div class="animate-pulse space-y-6">
					<div class="h-8 bg-gray-200 rounded w-1/2"></div>
					<div class="space-y-3">
						<div class="h-4 bg-gray-200 rounded"></div>
						<div class="h-4 bg-gray-200 rounded w-5/6"></div>
					</div>
				</div>
			{/snippet}
		</Card>
	{:else if resume}
		<div class="space-y-6">
			<!-- Header -->
			<Card>
				{#snippet children()}
					<div class="flex justify-between items-start">
						<div>
							<h1 class="text-2xl font-bold text-gray-900">{resume.original_filename}</h1>
							<p class="text-sm text-gray-500 mt-1">
								Uploaded on {formatDate(resume.created_at)}
							</p>
						</div>
						<Button variant="outline" onclick={() => goto('/jobs')}>
							{#snippet children()}
								View Matches
							{/snippet}
						</Button>
					</div>
				{/snippet}
			</Card>

			<!-- Contact Information -->
			{#if resume.parsed_data?.contact}
				<Card>
					{#snippet children()}
						<h2 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							{#if resume.parsed_data.contact.email}
								<div>
									<p class="text-sm font-medium text-gray-500">Email</p>
									<p class="text-gray-900">{resume.parsed_data.contact.email}</p>
								</div>
							{/if}
							{#if resume.parsed_data.contact.phone}
								<div>
									<p class="text-sm font-medium text-gray-500">Phone</p>
									<p class="text-gray-900">{resume.parsed_data.contact.phone}</p>
								</div>
							{/if}
							{#if resume.parsed_data.contact.location}
								<div>
									<p class="text-sm font-medium text-gray-500">Location</p>
									<p class="text-gray-900">{resume.parsed_data.contact.location}</p>
								</div>
							{/if}
							{#if resume.parsed_data.contact.linkedin}
								<div>
									<p class="text-sm font-medium text-gray-500">LinkedIn</p>
									<a
										href={resume.parsed_data.contact.linkedin}
										target="_blank"
										rel="noopener noreferrer"
										class="text-blue-600 hover:text-blue-700"
									>
										View Profile
									</a>
								</div>
							{/if}
						</div>
					{/snippet}
				</Card>
			{/if}

			<!-- Skills -->
			{#if resume.parsed_data?.skills && resume.parsed_data.skills.length > 0}
				<Card>
					{#snippet children()}
						<div class="flex justify-between items-center mb-4">
							<h2 class="text-lg font-semibold text-gray-900">Skills</h2>
							{#if !isEditingSkills}
								<Button variant="ghost" size="sm" onclick={startEditingSkills}>
									{#snippet children()}
										<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
											<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
										</svg>
										Edit
									{/snippet}
								</Button>
							{/if}
						</div>

						{#if isEditingSkills}
							<div class="space-y-4">
								<Input
									bind:value={skillsInput}
									placeholder="Enter skills separated by commas"
									label="Skills"
								/>
								<div class="flex justify-end space-x-3">
									<Button variant="outline" onclick={cancelEditingSkills} disabled={isSavingSkills}>
										{#snippet children()}
											Cancel
										{/snippet}
									</Button>
									<Button variant="primary" onclick={saveSkills} disabled={isSavingSkills}>
										{#snippet children()}
											{isSavingSkills ? 'Saving...' : 'Save'}
										{/snippet}
									</Button>
								</div>
							</div>
						{:else}
							<div class="flex flex-wrap gap-2">
								{#each resume.parsed_data.skills as skill}
									<span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
										{skill}
									</span>
								{/each}
							</div>
						{/if}
					{/snippet}
				</Card>
			{/if}

			<!-- Work Experience -->
			{#if resume.parsed_data?.experience && resume.parsed_data.experience.length > 0}
				<Card>
					{#snippet children()}
						<h2 class="text-lg font-semibold text-gray-900 mb-4">Work Experience</h2>
						<div class="space-y-6">
							{#each resume.parsed_data.experience as exp}
								<div class="border-l-2 border-gray-200 pl-4">
									<h3 class="font-semibold text-gray-900">{exp.position}</h3>
									<p class="text-gray-600">{exp.company}</p>
									{#if exp.start_date || exp.end_date}
										<p class="text-sm text-gray-500 mt-1">
											{exp.start_date || 'N/A'} - {exp.end_date || 'Present'}
										</p>
									{/if}
									{#if exp.description}
										<p class="text-gray-700 mt-2">{exp.description}</p>
									{/if}
								</div>
							{/each}
						</div>
					{/snippet}
				</Card>
			{/if}

			<!-- Education -->
			{#if resume.parsed_data?.education && resume.parsed_data.education.length > 0}
				<Card>
					{#snippet children()}
						<h2 class="text-lg font-semibold text-gray-900 mb-4">Education</h2>
						<div class="space-y-4">
							{#each resume.parsed_data.education as edu}
								<div>
									<h3 class="font-semibold text-gray-900">{edu.degree}</h3>
									<p class="text-gray-600">{edu.institution}</p>
									{#if edu.field}
										<p class="text-sm text-gray-500">{edu.field}</p>
									{/if}
									{#if edu.start_date || edu.end_date}
										<p class="text-sm text-gray-500 mt-1">
											{edu.start_date || 'N/A'} - {edu.end_date || 'Present'}
										</p>
									{/if}
								</div>
							{/each}
						</div>
					{/snippet}
				</Card>
			{/if}

			<!-- Summary -->
			{#if resume.parsed_data?.summary}
				<Card>
					{#snippet children()}
						<h2 class="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
						<p class="text-gray-700">{resume.parsed_data.summary}</p>
					{/snippet}
				</Card>
			{/if}
		</div>
	{/if}
</div>
