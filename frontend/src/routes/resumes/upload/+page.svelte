<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$lib/utils/api';
	import { toastStore } from '$lib/stores/toast';
	import type { Resume } from '$lib/types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import FileUpload from '$lib/components/ui/FileUpload.svelte';

	let selectedFile = $state<File | null>(null);
	let isUploading = $state(false);
	let uploadProgress = $state(0);
	let uploadedResume = $state<Resume | null>(null);

	function handleFileSelect(file: File) {
		selectedFile = file;
		uploadedResume = null;
	}

	async function handleUpload() {
		if (!selectedFile) return;

		isUploading = true;
		uploadProgress = 0;

		try {
			// Simulate progress (in real app, use XMLHttpRequest or fetch with progress)
			const progressInterval = setInterval(() => {
				uploadProgress = Math.min(uploadProgress + 10, 90);
			}, 200);

			const resume = await api.uploadResume(selectedFile);

			clearInterval(progressInterval);
			uploadProgress = 100;

			uploadedResume = resume;
			toastStore.success('Resume uploaded successfully!');

			// Wait a bit to show success state, then redirect
			setTimeout(() => {
				goto(`/resumes/${resume.id}`);
			}, 1500);
		} catch (error: any) {
			toastStore.error(error.detail || 'Failed to upload resume');
			uploadProgress = 0;
		} finally {
			isUploading = false;
		}
	}

	function handleCancel() {
		selectedFile = null;
		uploadProgress = 0;
		uploadedResume = null;
	}
</script>

<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900">Upload Your Resume</h1>
		<p class="text-gray-600 mt-2">
			Upload your CV and our AI will extract your skills, experience, and education
		</p>
	</div>

	<Card>
		{#snippet children()}
			{#if !selectedFile}
				<FileUpload onFileSelect={handleFileSelect} disabled={isUploading} />
			{:else}
				<div class="space-y-6">
					<!-- Selected File Info -->
					<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<div class="flex items-start justify-between">
							<div class="flex items-start space-x-3">
								<svg class="w-10 h-10 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
										clip-rule="evenodd"
									/>
								</svg>
								<div>
									<p class="font-medium text-gray-900">{selectedFile.name}</p>
									<p class="text-sm text-gray-600">
										{(selectedFile.size / 1024 / 1024).toFixed(2)} MB
									</p>
								</div>
							</div>
							{#if !isUploading && !uploadedResume}
								<button
									type="button"
									onclick={handleCancel}
									class="text-gray-400 hover:text-gray-600"
									aria-label="Remove file"
								>
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
											clip-rule="evenodd"
										/>
									</svg>
								</button>
							{/if}
						</div>
					</div>

					<!-- Upload Progress -->
					{#if isUploading}
						<div>
							<div class="flex justify-between text-sm text-gray-600 mb-2">
								<span>Uploading...</span>
								<span>{uploadProgress}%</span>
							</div>
							<div class="w-full bg-gray-200 rounded-full h-2">
								<div
									class="bg-blue-600 h-2 rounded-full transition-all duration-300"
									style="width: {uploadProgress}%"
								></div>
							</div>
							<p class="text-xs text-gray-500 mt-2">
								{uploadProgress < 100
									? 'Uploading and parsing your resume...'
									: 'Processing complete!'}
							</p>
						</div>
					{/if}

					<!-- Success Message -->
					{#if uploadedResume}
						<div class="bg-green-50 border border-green-200 rounded-lg p-4">
							<div class="flex items-center space-x-2">
								<svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
								<p class="text-green-800 font-medium">Resume uploaded successfully!</p>
							</div>
							<p class="text-sm text-green-700 mt-2">
								Redirecting to resume details...
							</p>
						</div>
					{/if}

					<!-- Action Buttons -->
					{#if !isUploading && !uploadedResume}
						<div class="flex justify-end space-x-3">
							<Button variant="outline" onclick={handleCancel}>
								{#snippet children()}
									Cancel
								{/snippet}
							</Button>
							<Button variant="primary" onclick={handleUpload}>
								{#snippet children()}
									Upload Resume
								{/snippet}
							</Button>
						</div>
					{/if}
				</div>
			{/if}
		{/snippet}
	</Card>

	<!-- Information Section -->
	<div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
		<h3 class="text-lg font-semibold text-blue-900 mb-4">What happens next?</h3>
		<ol class="space-y-3">
			<li class="flex items-start space-x-3">
				<span class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
					1
				</span>
				<div>
					<p class="font-medium text-blue-900">Resume Parsing</p>
					<p class="text-sm text-blue-700">
						Our AI extracts your skills, experience, and education from your resume
					</p>
				</div>
			</li>
			<li class="flex items-start space-x-3">
				<span class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
					2
				</span>
				<div>
					<p class="font-medium text-blue-900">Review & Edit</p>
					<p class="text-sm text-blue-700">
						You can review and edit the extracted information to ensure accuracy
					</p>
				</div>
			</li>
			<li class="flex items-start space-x-3">
				<span class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
					3
				</span>
				<div>
					<p class="font-medium text-blue-900">Job Matching</p>
					<p class="text-sm text-blue-700">
						We'll find jobs that match your profile and notify you of new opportunities
					</p>
				</div>
			</li>
		</ol>
	</div>
</div>
