import type {CSSProperties} from 'react';
import {Img, staticFile} from 'remotion';

export type Pose =
	| 'shunsui-stance'
	| 'shunsui-attack'
	| 'gojo-stance'
	| 'gojo-red'
	| 'gojo-ultimate';

export const Fighter: React.FC<{
	pose: Pose;
	left: number;
	bottom: number;
	height: number;
	flip?: boolean;
	opacity?: number;
	transform?: string;
	filter?: string;
	style?: CSSProperties;
}> = ({
	pose,
	left,
	bottom,
	height,
	flip = false,
	opacity = 1,
	transform = '',
	filter = 'drop-shadow(0 20px 18px rgba(0,0,0,0.38))',
	style,
}) => (
	<Img
		src={staticFile(`${pose}-cutout.png`)}
		style={{
			position: 'absolute',
			left,
			bottom,
			height,
			width: 'auto',
			opacity,
			filter,
			transformOrigin: '50% 100%',
			transform: `${transform} scaleX(${flip ? -1 : 1})`,
			...style,
		}}
	/>
);

export const GroundShadow: React.FC<{
	left: number;
	bottom: number;
	width: number;
	opacity?: number;
	color?: string;
}> = ({left, bottom, width, opacity = 0.36, color = '#071019'}) => (
	<div
		style={{
			position: 'absolute',
			left,
			bottom,
			width,
			height: width * 0.12,
			borderRadius: '50%',
			background: `radial-gradient(ellipse, ${color} 0%, transparent 70%)`,
			opacity,
			transform: 'translateX(-50%)',
		}}
	/>
);
