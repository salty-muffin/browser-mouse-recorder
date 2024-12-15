<script lang="ts">
	import '$lib/styles/global.scss';

	import Placeholder from '$lib/components/placeholder.svelte';

	import { onMount } from 'svelte';

	type MouseDataType = 'move' | 'scroll';

	interface MouseData {
		type: MouseDataType;
		deltaX?: number;
		deltaY?: number;
		offsetX?: number;
		offsetY?: number;
		timestampMs: number;
	}

	const recordScroll = true;
	const recordMouseMove = true;

	let recording = $state(false);
	let textOutput = $state(
		`Scroll recording is ${recordScroll ? 'enabled' : 'disabled'}. Mouse move recording is ${recordMouseMove ? 'enabled' : 'disabled'}.`
	);

	onMount(() => {
		let recordingStart: number;
		let scrollData: MouseData[] = [];

		const handleKeydown = (event: KeyboardEvent) => {
			if (event.code === 'Space') {
				recording = !recording; // Toggle recording state
				if (recording) {
					textOutput = `'Recording started...'`;

					recordingStart = Date.now();
				} else {
					textOutput = 'Recording stopped. See console for data.';

					console.log(scrollData);
					scrollData = []; // Clear the data after logging
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

		document.addEventListener('keydown', handleKeydown);
		document.addEventListener('wheel', handleScroll);
		document.addEventListener('mousemove', handleMouseMove);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
			document.removeEventListener('wheel', handleScroll);
			document.removeEventListener('mousemove', handleMouseMove);
		};
	});

	const getRandomInt = (max: number) => {
		return Math.floor(Math.random() * max);
	};

	const createRandomPlaceholders = (length: number, maxComments = 2) => {
		type imageOption = false | 'half' | 'full';
		const placeholders: { image: imageOption; comment: boolean }[] = [];
		const imageOptions: imageOption[] = [false, 'half', 'full'];
		for (let i = 0; i < length; i++) {
			placeholders.push({
				image: imageOptions[getRandomInt(imageOptions.length)],
				comment: getRandomInt(2) > 0
			});
		}
		return placeholders;
	};

	const placeholders = createRandomPlaceholders(5);
</script>

<div id="container">
	{#each placeholders as placeholder}
		<Placeholder {...placeholder} />
	{/each}
	<div id="output">
		<span id="recording" class:recording></span>
		<span id="text">{textOutput}</span>
	</div>
</div>

<style lang="scss">
	#container {
		display: flex;
		flex-direction: column;
		width: 100vw;
		min-height: 100vh;
	}

	#output {
		position: fixed;
		top: 1rem;
		left: 1rem;
		right: 1rem;
		padding: 0.5rem 1rem;

		background-color: black;

		display: flex;
		align-items: center;
		gap: 1rem;
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
