import {Easing, interpolate} from 'remotion';

export const clamp = (value: number, min = 0, max = 1) =>
	Math.min(max, Math.max(min, value));

export const progress = (
	frame: number,
	start: number,
	end: number,
	easing: (t: number) => number = Easing.linear,
) =>
	interpolate(frame, [start, end], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing,
	});

export const random = (seed: number) => {
	const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
	return value - Math.floor(value);
};

export const shake = (frame: number, strength: number) => ({
	x: Math.sin(frame * 2.17) * strength + Math.sin(frame * 0.71) * strength * 0.45,
	y: Math.cos(frame * 1.73) * strength * 0.65,
	rotate: Math.sin(frame * 1.13) * strength * 0.035,
});

export const fade = (frame: number, start: number, end: number) =>
	progress(frame, start, end, Easing.out(Easing.cubic));
