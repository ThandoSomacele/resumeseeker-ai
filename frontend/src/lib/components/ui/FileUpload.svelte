<script lang="ts">
	import { isValidResumeFile, getFileExtension } from '$lib/utils/helpers';

	interface Props {
		onFileSelect: (file: File) => void;
		accept?: string;
		maxSizeMB?: number;
		disabled?: boolean;
	}

	let {
		onFileSelect,
		accept = '.pdf,.doc,.docx',
		maxSizeMB = 10,
		disabled = false
	}: Props = $props();

	let isDragging = $state(false);
	let error = $state<string | null>(null);
	let fileInputRef: HTMLInputElement;

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		if (!disabled) {
			isDragging = true;
		}
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;

		if (disabled) return;

		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			handleFile(files[0]);
		}
	}

	function handleFileInput(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			handleFile(input.files[0]);
		}
	}

	function handleFile(file: File) {
		error = null;

		// Validate file type
		if (!isValidResumeFile(file)) {
			const ext = getFileExtension(file.name);
			if (!accept.includes(ext)) {
				error = `Invalid file type. Please upload ${accept}`;
				return;
			}
			if (file.size > maxSizeMB * 1024 * 1024) {
				error = `File too large. Maximum size is ${maxSizeMB}MB`;
				return;
			}
		}

		onFileSelect(file);
	}

	function openFilePicker() {
		if (!disabled) {
			fileInputRef?.click();
		}
	}
</script>

<div class="w-full">
	<div
		class="border-2 border-dashed rounded-lg p-8 text-center transition-colors {isDragging
			? 'border-blue-500 bg-blue-50'
			: error
				? 'border-red-300 bg-red-50'
				: 'border-gray-300 hover:border-gray-400'} {disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		onclick={openFilePicker}
		onkeydown={(e) => e.key === 'Enter' && openFilePicker()}
		role="button"
		tabindex={disabled ? -1 : 0}
	>
		<input
			bind:this={fileInputRef}
			type="file"
			{accept}
			onchange={handleFileInput}
			{disabled}
			class="hidden"
			aria-label="File upload input"
		/>

		<div class="flex flex-col items-center">
			<svg
				class="w-12 h-12 mb-4 {error ? 'text-red-400' : isDragging ? 'text-blue-500' : 'text-gray-400'}"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
				/>
			</svg>

			<p class="text-lg font-medium text-gray-700 mb-2">
				{isDragging ? 'Drop your resume here' : 'Upload your resume'}
			</p>

			<p class="text-sm text-gray-500 mb-4">
				Drag and drop or click to browse
			</p>

			<p class="text-xs text-gray-400">
				Supported formats: PDF, DOC, DOCX (max {maxSizeMB}MB)
			</p>

			{#if error}
				<p class="mt-4 text-sm text-red-600 font-medium">{error}</p>
			{/if}
		</div>
	</div>
</div>
