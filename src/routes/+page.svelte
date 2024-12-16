<script lang="ts">
	import '$lib/styles/global.scss';

	import Placeholder from '$lib/components/placeholder.svelte';

	import { onMount } from 'svelte';

	import type { MouseData } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let recordScroll = $state(true);
	let recordMouseMove = $state(true);

	let recording = $state(false);
	let textOutput = $state('Press SPACE to start and stop recording.');

	let recordingStart: number;
	let scrollData: MouseData[] = [];

	const handleKeydown = async (event: KeyboardEvent) => {
		if (event.code === 'Space') {
			recording = !recording; // Toggle recording state
			if (recording) {
				textOutput = `'Recording started...'`;

				recordingStart = Date.now();
			} else {
				console.log(scrollData);
				const response = await fetch('/save', {
					method: 'POST',
					body: JSON.stringify(scrollData),
					headers: {
						'content-type': 'application/json'
					}
				});
				scrollData = []; // Clear the data after logging

				textOutput = `Recording stopped. Saved on the server as '${(await response.json()).filename}'`;
			}
			event.preventDefault(); // Prevent default spacebar behavior (scrolling)
		}
	};

	const handleScroll = (event: WheelEvent) => {
		if (recording && recordScroll) {
			scrollData.push({
				type: 'scroll',
				deltaX: event.deltaX,
				deltaY: event.deltaY,
				timestampMs: Date.now() - recordingStart
			});
		}
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (recording && recordMouseMove) {
			scrollData.push({
				type: 'move',
				offsetX: event.offsetX / window.innerWidth,
				offsetY: event.offsetY / window.innerHeight,
				timestampMs: Date.now() - recordingStart
			});
		}
	};

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		document.addEventListener('wheel', handleScroll);
		document.addEventListener('mousemove', handleMouseMove);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
			document.removeEventListener('wheel', handleScroll);
			document.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<div id="container">
	{#each data.placeholders as placeholder}
		<Placeholder {...placeholder} />
	{/each}
	<div id="output" class="overlay">
		<span id="recording" class:recording></span>
		<span id="text">{textOutput}</span>
	</div>
	<div id="settings" class="overlay">
		<div class="checkbox-group">
			<input type="checkbox" id="scroll" name="scroll" bind:checked={recordScroll} />
			<label for="scroll">Record scroll events</label>
		</div>
		<div class="checkbox-group">
			<input type="checkbox" id="mouse" name="mouse" bind:checked={recordMouseMove} />
			<label for="mouse">Record mouse events</label>
		</div>
	</div>
</div>

<style lang="scss">
	@use 'sass:color';

	.overlay {
		position: fixed;

		padding: 0.5rem 1rem;
		background-color: color.adjust(black, $alpha: -0.5);
	}

	#container {
		display: flex;
		flex-direction: column;
		width: 100vw;
		min-height: 100vh;
	}

	#output {
		top: 1rem;
		left: 1rem;

		display: flex;
		align-items: center;
		gap: 1rem;
	}

	#settings {
		bottom: 1rem;
		left: 1rem;
	}

	#recording {
		display: inline-block;
		background-color: grey;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;

		&.recording {
			background-color: red;
		}
	}
</style>
