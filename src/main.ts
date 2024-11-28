import './style.scss';
import config from './config.yml';

type MouseDataType = 'move' | 'scroll';

interface MouseData {
	type: MouseDataType;
	deltaX?: number;
	deltaY?: number;
	offsetX?: number;
	offsetY?: number;
	timestampMs: number;
}

const outputText = document.getElementById('text') as HTMLSpanElement | null;
const outputRecording = document.getElementById('recording') as HTMLSpanElement | null;

let isRecording = false;
let scrollData: MouseData[] = [];
let recordingStart: number;

if (outputText && outputRecording) {
	const handleKeydown = (event: KeyboardEvent) => {
		if (event.code === 'Space') {
			isRecording = !isRecording; // Toggle recording state
			if (isRecording) {
				outputText.innerText = `'Recording started...'`;
				outputRecording.classList.add('active');

				recordingStart = Date.now();
			} else {
				outputText.innerText = 'Recording stopped. See console for data.';
				outputRecording.classList.remove('active');

				// console.log(JSON.stringify(scrollData, null, '  '));
				console.log(scrollData);
				scrollData = []; // Clear the data after logging
			}
			event.preventDefault(); // Prevent default spacebar behavior (scrolling)
		}
	};

	const handleScroll = (event: WheelEvent) => {
		if (isRecording && config.recordScroll) {
			scrollData.push({
				type: 'scroll',
				deltaX: event.deltaX,
				deltaY: event.deltaY,
				timestampMs: Date.now() - recordingStart
			});
		}
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (isRecording && config.recordMouseMove) {
			scrollData.push({
				type: 'scroll',
				offsetX: event.offsetX / window.innerWidth,
				offsetY: event.offsetY / window.innerHeight,
				timestampMs: Date.now() - recordingStart
			});
		}
	};

	outputText.innerText = `Loaded ${config.iframeContent} into iframe. Scroll recording is ${config.recordScroll ? 'enabled' : 'disabled'}. Mouse move recording is ${config.recordMouseMove ? 'enabled' : 'disabled'}.`;

	document.addEventListener('keydown', handleKeydown);
	document.addEventListener('wheel', handleScroll);
	document.addEventListener('mousemove', handleMouseMove);
}
