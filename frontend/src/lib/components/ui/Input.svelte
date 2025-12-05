<script lang="ts">
	interface Props {
		type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
		value?: string | number;
		placeholder?: string;
		disabled?: boolean;
		required?: boolean;
		id?: string;
		name?: string;
		class?: string;
		error?: string;
		label?: string;
		oninput?: (e: Event) => void;
		onchange?: (e: Event) => void;
	}

	let {
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		disabled = false,
		required = false,
		id,
		name,
		class: className = '',
		error,
		label,
		oninput,
		onchange
	}: Props = $props();

	const inputClasses = $derived(`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100 transition-colors ${
		error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
	} ${className}`);
</script>

<div class="w-full">
	{#if label}
		<label for={id} class="block text-sm font-medium text-gray-700 mb-1">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}
	<input
		{type}
		bind:value
		{placeholder}
		{disabled}
		{required}
		{id}
		{name}
		class={inputClasses}
		{oninput}
		{onchange}
	/>
	{#if error}
		<p class="mt-1 text-sm text-red-600">{error}</p>
	{/if}
</div>
