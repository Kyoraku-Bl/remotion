import {useId} from 'react';
import {Img, staticFile} from 'remotion';
import {clamp, progress, random} from '../lib/animation';

export const SpeedLines: React.FC<{
	frame: number;
	color?: string;
	opacity?: number;
	mode?: 'radial' | 'horizontal';
	count?: number;
}> = ({frame, color = '#fff7df', opacity = 0.65, mode = 'radial', count = 64}) => {
	const tick = Math.floor(frame / 2);
	return (
		<svg
			width="1920"
			height="1080"
			viewBox="0 0 1920 1080"
			style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity}}
		>
			{new Array(count).fill(null).map((_, index) => {
				const seed = index + tick * 83;
				if (mode === 'horizontal') {
					const y = random(seed + 1) * 1080;
					const x = random(seed + 2) * 1900 - 300;
					const length = 180 + random(seed + 3) * 720;
					return (
						<line
							key={index}
							x1={x}
							y1={y}
							x2={x + length}
							y2={y - 18}
							stroke={color}
							strokeWidth={1 + random(seed + 4) * 6}
							opacity={0.25 + random(seed + 5) * 0.7}
						/>
					);
				}
				const angle = random(seed + 1) * Math.PI * 2;
				const inner = 190 + random(seed + 2) * 430;
				const length = 150 + random(seed + 3) * 620;
				const centerX = 960 + Math.sin(tick * 0.7) * 40;
				const centerY = 500;
				return (
					<line
						key={index}
						x1={centerX + Math.cos(angle) * inner}
						y1={centerY + Math.sin(angle) * inner * 0.62}
						x2={centerX + Math.cos(angle) * (inner + length)}
						y2={centerY + Math.sin(angle) * (inner + length) * 0.62}
						stroke={color}
						strokeWidth={1 + random(seed + 4) * 5}
						opacity={0.2 + random(seed + 5) * 0.75}
					/>
				);
			})}
		</svg>
	);
};

export const EnergyOrb: React.FC<{
	frame: number;
	x: number;
	y: number;
	size: number;
	color: string;
	secondary?: string;
	opacity?: number;
}> = ({frame, x, y, size, color, secondary = '#ffffff', opacity = 1}) => {
	const id = useId().replace(/:/g, '');
	return (
		<div
			style={{
				position: 'absolute',
				left: x - size / 2,
				top: y - size / 2,
				width: size,
				height: size,
				opacity,
				mixBlendMode: 'screen',
				filter: `drop-shadow(0 0 ${Math.max(8, size * 0.08)}px ${color})`,
				pointerEvents: 'none',
			}}
		>
			<svg viewBox="0 0 200 200" width="100%" height="100%">
				<defs>
					<radialGradient id={`core-${id}`}>
						<stop offset="0%" stopColor="#ffffff" />
						<stop offset="18%" stopColor={secondary} />
						<stop offset="48%" stopColor={color} stopOpacity="0.95" />
						<stop offset="72%" stopColor={color} stopOpacity="0.35" />
						<stop offset="100%" stopColor={color} stopOpacity="0" />
					</radialGradient>
				</defs>
				<circle cx="100" cy="100" r="98" fill={`url(#core-${id})`} />
				{[0, 1, 2, 3].map((ring) => (
					<g key={ring} transform={`rotate(${frame * (ring % 2 ? -4 : 5) + ring * 43} 100 100)`}>
						<ellipse
							cx="100"
							cy="100"
							rx={44 + ring * 10}
							ry={25 + ring * 8}
							fill="none"
							stroke={ring % 2 ? secondary : color}
							strokeWidth={2.5 - ring * 0.3}
							strokeDasharray={`${22 + ring * 7} ${9 + ring * 4}`}
							opacity={0.75 - ring * 0.1}
						/>
					</g>
				))}
				<circle cx="100" cy="100" r={28 + Math.sin(frame * 0.7) * 3} fill="#fff" opacity="0.72" />
			</svg>
		</div>
	);
};

export const InfinityBarrier: React.FC<{
	frame: number;
	x: number;
	y: number;
	size?: number;
	impact?: number;
}> = ({frame, x, y, size = 620, impact = 0}) => {
	const pulse = 1 + Math.sin(frame * 0.22) * 0.012 + impact * 0.035;
	return (
		<div
			style={{
				position: 'absolute',
				left: x - size / 2,
				top: y - size / 2,
				width: size,
				height: size,
				transform: `scale(${pulse})`,
				mixBlendMode: 'screen',
				pointerEvents: 'none',
			}}
		>
			<svg viewBox="0 0 600 600" width="100%" height="100%">
				<defs>
					<radialGradient id="infinity-fill">
						<stop offset="0%" stopColor="#9eefff" stopOpacity="0.01" />
						<stop offset="72%" stopColor="#7edfff" stopOpacity="0.035" />
						<stop offset="94%" stopColor="#c9f8ff" stopOpacity="0.16" />
						<stop offset="100%" stopColor="#efffff" stopOpacity="0.5" />
					</radialGradient>
					<radialGradient id="impact-fill">
						<stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
						<stop offset="35%" stopColor="#8defff" stopOpacity="0.45" />
						<stop offset="100%" stopColor="#65dfff" stopOpacity="0" />
					</radialGradient>
				</defs>
				<circle cx="300" cy="300" r="270" fill="url(#infinity-fill)" stroke="#c8f8ff" strokeWidth="2" opacity="0.8" />
				<circle cx="300" cy="300" r={250 + Math.sin(frame * 0.3) * 6} fill="none" stroke="#83ddff" strokeWidth="3" strokeDasharray="110 28 8 24" opacity="0.48" transform={`rotate(${frame * 0.8} 300 300)`} />
				<circle cx="300" cy="300" r="224" fill="none" stroke="#e9ffff" strokeWidth="1.5" strokeDasharray="4 17" opacity="0.55" transform={`rotate(${-frame} 300 300)`} />
				{new Array(12).fill(null).map((_, index) => {
					const angle = (index / 12) * Math.PI * 2 + frame * 0.002;
					const px = 300 + Math.cos(angle) * 205;
					const py = 300 + Math.sin(angle) * 205;
					return (
						<polygon
							key={index}
							points="0,-26 23,-13 23,13 0,26 -23,13 -23,-13"
							transform={`translate(${px} ${py}) rotate(${index * 30 + frame * 0.4})`}
							fill="none"
							stroke="#b7f3ff"
							strokeWidth="1.4"
							opacity="0.25"
						/>
					);
				})}
				<ellipse cx="92" cy="300" rx={30 + impact * 85} ry={190 + impact * 25} fill="url(#impact-fill)" opacity={0.3 + impact * 0.7} />
				{[0, 1, 2].map((ring) => (
					<path
						key={ring}
						d={`M ${112 + ring * 26} ${160 - ring * 12} Q ${20 - impact * 40} 300 ${112 + ring * 26} ${440 + ring * 12}`}
						fill="none"
						stroke={ring === 0 ? '#ffffff' : '#8deaff'}
						strokeWidth={5 - ring}
						opacity={(0.8 - ring * 0.18) * (0.35 + impact * 0.65)}
					/>
				))}
			</svg>
		</div>
	);
};

export const InkAura: React.FC<{
	frame: number;
	x: number;
	y: number;
	scale?: number;
	intensity?: number;
	color?: string;
}> = ({frame, x, y, scale = 1, intensity = 1, color = '#080713'}) => (
	<svg
		width="1920"
		height="1080"
		viewBox="0 0 1920 1080"
		style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}}
	>
		<defs>
			<radialGradient id="ink-pool">
				<stop offset="0%" stopColor={color} stopOpacity="0.98" />
				<stop offset="65%" stopColor="#171027" stopOpacity="0.8" />
				<stop offset="100%" stopColor="#080713" stopOpacity="0" />
			</radialGradient>
		</defs>
		<g transform={`translate(${x} ${y}) scale(${scale})`} opacity={intensity}>
			<ellipse cx="0" cy="0" rx={280 + Math.sin(frame * 0.1) * 25} ry="76" fill="url(#ink-pool)" />
			{new Array(18).fill(null).map((_, index) => {
				const angle = -Math.PI + (index / 17) * Math.PI;
				const length = 180 + random(index + 3) * 410;
				const sway = Math.sin(frame * 0.08 + index * 1.7) * (35 + random(index) * 45);
				const endX = Math.cos(angle) * length * 0.85 + sway;
				const endY = -Math.abs(Math.sin(angle)) * length - 35;
				const startX = (index - 8.5) * 22;
				return (
					<path
						key={index}
						d={`M ${startX} 10 C ${startX - 60} ${-length * 0.25}, ${endX + sway} ${-length * 0.62}, ${endX} ${endY} C ${endX + 28} ${endY + 80}, ${startX + 75} ${-length * 0.18}, ${startX + 18} 12 Z`}
						fill={index % 3 === 0 ? '#171027' : color}
						opacity={0.5 + random(index + 8) * 0.48}
					/>
				);
			})}
			{new Array(9).fill(null).map((_, index) => (
				<circle
					key={`drop-${index}`}
					cx={(random(index + 40) - 0.5) * 600}
					cy={-((frame * (3 + random(index) * 5) + random(index + 2) * 500) % 500)}
					r={3 + random(index + 20) * 12}
					fill={color}
					opacity="0.75"
				/>
			))}
		</g>
	</svg>
);

export const ParticleBurst: React.FC<{
	frame: number;
	start: number;
	originX: number;
	originY: number;
	count?: number;
	color?: string;
	secondary?: string;
	duration?: number;
	power?: number;
}> = ({
	frame,
	start,
	originX,
	originY,
	count = 60,
	color = '#ffd27a',
	secondary = '#fff6d8',
	duration = 48,
	power = 900,
}) => {
	const t = clamp((frame - start) / duration);
	if (frame < start || frame > start + duration) return null;
	return (
		<div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
			{new Array(count).fill(null).map((_, index) => {
				const angle = random(index + 13) * Math.PI * 2;
				const velocity = power * (0.2 + random(index + 31) * 0.8);
				const distance = velocity * t;
				const x = originX + Math.cos(angle) * distance;
				const y = originY + Math.sin(angle) * distance * 0.6 + 440 * t * t;
				const size = 3 + random(index + 50) * 15;
				return (
					<div
						key={index}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: size * (1 + t * 2),
							height: Math.max(2, size * 0.35),
							borderRadius: index % 4 === 0 ? '50%' : '20%',
							background: index % 3 === 0 ? secondary : color,
							opacity: (1 - t) * (0.5 + random(index + 8) * 0.5),
							transform: `rotate(${angle + t * 8}rad)`,
							boxShadow: `0 0 ${size}px ${color}`,
						}}
					/>
				);
			})}
		</div>
	);
};

export const ImpactFlash: React.FC<{
	frame: number;
	start: number;
	color?: string;
	duration?: number;
	strength?: number;
}> = ({frame, start, color = '#ffffff', duration = 8, strength = 1}) => {
	if (frame < start || frame > start + duration) return null;
	const opacity = (1 - (frame - start) / duration) * strength;
	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				background: color,
				opacity,
				mixBlendMode: 'screen',
				pointerEvents: 'none',
			}}
		/>
	);
};

export const TechniqueTitle: React.FC<{
	title: string;
	subtitle?: string;
	frame: number;
	start?: number;
	align?: 'left' | 'right';
	color?: string;
}> = ({title, subtitle, frame, start = 0, align = 'left', color = '#ffffff'}) => {
	const enter = progress(frame, start, start + 10);
	const exit = 1 - progress(frame, start + 42, start + 55);
	return (
		<div
			style={{
				position: 'absolute',
				[align]: 92,
				bottom: 112,
				textAlign: align,
				opacity: Math.min(enter, exit),
				transform: `translateX(${(1 - enter) * (align === 'left' ? -45 : 45)}px)`,
				fontFamily: 'Arial, Helvetica, sans-serif',
				color,
				textTransform: 'uppercase',
				filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.75))',
			}}
		>
			<div style={{width: 94, height: 4, background: color, marginBottom: 14, marginLeft: align === 'right' ? 'auto' : 0}} />
			<div style={{fontSize: 58, lineHeight: 0.95, letterSpacing: 10, fontWeight: 900, fontStyle: 'italic'}}>{title}</div>
			{subtitle ? <div style={{fontSize: 16, letterSpacing: 5, marginTop: 16, opacity: 0.78}}>{subtitle}</div> : null}
		</div>
	);
};

export const FilmFinish: React.FC<{frame: number}> = ({frame}) => (
	<>
		<div
			style={{
				position: 'absolute',
				inset: 0,
				pointerEvents: 'none',
				background: 'radial-gradient(ellipse at center, transparent 48%, rgba(2,5,12,0.16) 72%, rgba(2,5,12,0.58) 110%)',
			}}
		/>
		<Img
			src={staticFile('grain.png')}
			style={{
				position: 'absolute',
				left: '-12%',
				top: '-12%',
				width: '124%',
				height: '124%',
				objectFit: 'cover',
				imageRendering: 'pixelated',
				opacity: 0.055,
				mixBlendMode: 'soft-light',
				transform: `translate(${(frame % 4) * 7}px, ${(frame % 3) * -9}px)`,
				pointerEvents: 'none',
			}}
		/>
		<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 38, background: '#030508'}} />
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 38, background: '#030508'}} />
	</>
);
