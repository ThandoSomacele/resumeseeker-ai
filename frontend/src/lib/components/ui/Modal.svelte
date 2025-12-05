<script lang="ts">
	interface Props {
		isOpen?: boolean;
		title?: string;
		onClose?: () => void;
		children?: import('svelte').Snippet;
		footer?: import('svelte').Snippet;
	}

	let { isOpen = $bindable(false), title, onClose, children, footer }: Props = $props();

	function handleClose() {
		isOpen = false;
		onClose?.();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
		onclick={handleBackdropClick}
		role="presentation"
	>
		<div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
			{#if title}
				<div class="flex items-center justify-between p-6 border-b border-gray-200">
					<h2 class="text-xl font-semibold text-gray-900">{title}</h2>
					<button
						type="button"
						class="text-gray-400 hover:text-gray-600 transition-colors"
						onclick={handleClose}
						aria-label="Close modal"
					>
						<svg
							class="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
			{/if}

			<div class="p-6">
				{#if children}
					{@render children()}
				{/if}
			</div>

			{#if footer}
				<div class="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
