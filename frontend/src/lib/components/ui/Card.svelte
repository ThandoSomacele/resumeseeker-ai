<script lang="ts">
	interface Props {
		class?: string;
		padding?: 'none' | 'sm' | 'md' | 'lg';
		hover?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		class: className = '',
		padding = 'md',
		hover = false,
		children
	}: Props = $props();

	const paddingClasses = {
		none: '',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8'
	};

	const baseClasses = $derived(`bg-white rounded-lg shadow-md border border-gray-200 ${paddingClasses[padding]} ${
		hover ? 'transition-shadow hover:shadow-lg' : ''
	} ${className}`);
</script>

<div class={baseClasses}>
	{#if children}
		{@render children()}
	{/if}
</div>
