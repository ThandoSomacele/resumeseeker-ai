<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth';
	import Toast from '$lib/components/ui/Toast.svelte';
	import Navbar from '$lib/components/ui/Navbar.svelte';

	let { children } = $props();

	onMount(() => {
		authStore.initialize();
	});
</script>

<div class="min-h-screen bg-gray-50">
	<Navbar />
	<main>
		{@render children()}
	</main>
	<Toast />
</div>
