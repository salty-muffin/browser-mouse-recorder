/// <reference types="vite/client" />

declare module '*.yaml' {
	const value: any; // Replace `any` with a specific type if known
	export default value;
}

declare module '*.yml' {
	const value: any;
	export default value;
}
