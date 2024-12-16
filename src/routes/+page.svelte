<script lang="ts">
	import '$lib/styles/global.scss';

	import Placeholder from '$lib/components/placeholder.svelte';

	import { onMount } from 'svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let recordScroll = $state(true);
	let recordMouseMove = $state(true);

	let recording = $state(false);
	let playing = $state(false);
	let textOutput = $state('Press SPACE to start and stop recording.');

	let cursorPosition = $state({ x: 0, y: 0 });
	let scrollPosition = $state({ x: 0, y: 0 });
	let innerWidth = $state(0);
	let innerHeight = $state(0);
	$effect(() => {
		console.log(cursorPosition.x * innerWidth, cursorPosition.y * innerHeight);
	});

	let recordingStart: number;
	let recordingData: MouseData[];
	let playbackStart: number;
	let playbackData: MouseData[];

	type MouseDataType = 'move' | 'scroll';
	interface MouseData {
		type: MouseDataType;
		scrollDeltaX?: number;
		scrollDeltaY?: number;
		mouseX?: number;
		mouseY?: number;
		timestampMs: number;
	}

	const play = (timestamp: number) => {
		if (!playbackData.length) playing = false;

		let currentData: MouseData | null = null;
		while (playbackData.length && playbackData[0].timestampMs <= timestamp - playbackStart) {
			currentData = playbackData.shift() ?? null;
		}
		if (currentData) {
			if (currentData.type === 'move') {
				cursorPosition = { x: currentData.mouseX as number, y: currentData.mouseY as number };
			} else if (currentData.type === 'scroll') {
				scrollPosition = {
					x: Math.max((currentData.scrollDeltaX as number) + scrollPosition.x, 0),
					y: Math.max((currentData.scrollDeltaY as number) + scrollPosition.y, 0)
				};
			}
		}
		if (playing) {
			requestAnimationFrame(play);
		} else {
			textOutput = 'Press SPACE to start and stop recording. Press P to play last recording.';
		}
	};

	const handleKeydown = async (event: KeyboardEvent) => {
		if (event.code === 'Space' && !playing) {
			event.preventDefault(); // Prevent default spacebar behavior (scrolling)

			// Recording
			recording = !recording; // Toggle recording state
			if (recording) {
				recordingData = []; // Clear the data berfore recording
				recordingStart = Date.now();

				textOutput = `'Recording started...'`;
			} else {
				console.log(recordingData);
				const response = await fetch('/save', {
					method: 'POST',
					body: JSON.stringify(recordingData),
					headers: {
						'content-type': 'application/json'
					}
				});

				textOutput = `Recording stopped. Saved on the server as '${(await response.json()).filename}'. Press P to play last recording.`;
			}
		} else if (event.code === 'KeyP' && !recording) {
			event.preventDefault();

			// Playback
			playing = !playing;
			if (playing) {
				playbackData = [...recordingData];
				playbackStart = Number(document.timeline.currentTime);

				requestAnimationFrame(play);

				textOutput = `'Playback started...'`;
			}
		}
	};

	const handleScroll = (event: WheelEvent) => {
		if (recording && recordScroll) {
			recordingData.push({
				type: 'scroll',
				scrollDeltaX: event.deltaX,
				scrollDeltaY: event.deltaY,
				timestampMs: Date.now() - recordingStart
			});
		}
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (recording && recordMouseMove) {
			recordingData.push({
				type: 'move',
				mouseX: event.clientX / innerWidth,
				mouseY: event.clientY / innerHeight,
				timestampMs: Date.now() - recordingStart
			});
		}
	};

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('wheel', handleScroll);
		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('wheel', handleScroll);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div id="container">
	{#each data.placeholders as placeholder}
		<Placeholder {...placeholder} />
	{/each}
	<div id="output" class="overlay">
		<span id="recording" class:recording class:playing></span>
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
	<div
		id="cursor"
		class:playing
		style:left="{cursorPosition.x * innerWidth}px"
		style:top="{cursorPosition.y * innerHeight}px"
	></div>
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

		&.playing {
			background-color: green;
		}
	}

	#cursor {
		width: 20px;
		height: 20px;
		background-color: white;

		position: fixed;
		display: none;

		&.playing {
			display: block;
		}
	}
</style>
