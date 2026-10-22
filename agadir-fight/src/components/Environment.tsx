import {Img, staticFile} from 'remotion';
import {random} from '../lib/animation';

export const CoastBackground: React.FC<{
	frame: number;
	scale?: number;
	x?: number;
	y?: number;
	dark?: number;
	tint?: string;
}> = ({frame, scale = 1.06, x = 0, y = 0, dark = 0, tint = 'transparent'}) => (
	<div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#132c36'}}>
		<Img
			src={staticFile('agadir-coast.png')}
			style={{
				position: 'absolute',
				inset: '-4%',
				width: '108%',
				height: '108%',
				objectFit: 'cover',
				transform: `translate(${x - frame * 0.08}px, ${y}px) scale(${scale})`,
			}}
		/>
		<div
			style={{
				position: 'absolute',
				inset: 0,
				background: `linear-gradient(110deg, rgba(255,178,78,${0.08 + dark * 0.1}) 0%, transparent 42%, ${tint} 100%)`,
			}}
		/>
		<div style={{position: 'absolute', inset: 0, background: `rgba(3,7,18,${dark})`}} />
		<div
			style={{
				position: 'absolute',
				right: 0,
				top: '47%',
				width: '46%',
				height: '18%',
				opacity: 0.16,
				background:
					`repeating-linear-gradient(${172 + Math.sin(frame * 0.04) * 2}deg, transparent 0px, rgba(255,244,190,0.65) 2px, transparent 4px, transparent 17px)`,
				mixBlendMode: 'screen',
			}}
		/>
	</div>
);

export const AerialBackground: React.FC<{
	frame: number;
	scale?: number;
	x?: number;
	y?: number;
	dark?: number;
}> = ({frame, scale = 1, x = 0, y = 0, dark = 0}) => (
	<div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#102d40'}}>
		<Img
			src={staticFile('agadir-bay-aerial.png')}
			style={{
				position: 'absolute',
				inset: '-5%',
				width: '110%',
				height: '110%',
				objectFit: 'cover',
				transform: `translate(${x}px, ${y + Math.sin(frame * 0.025) * 3}px) scale(${scale})`,
			}}
		/>
		<div style={{position: 'absolute', inset: 0, background: `rgba(5,7,24,${dark})`}} />
	</div>
);

export const WindLeaves: React.FC<{frame: number; count?: number}> = ({
	frame,
	count = 9,
}) => (
	<div style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'}}>
		{new Array(count).fill(null).map((_, index) => {
			const travel = (frame * (4 + random(index) * 5) + random(index + 4) * 2200) % 2300;
			const left = 2100 - travel;
			const top = 100 + random(index + 9) * 700 + Math.sin(frame * 0.07 + index) * 55;
			const rotation = frame * (2 + random(index + 2) * 4) + index * 40;
			return (
				<div
					key={index}
					style={{
						position: 'absolute',
						left,
						top,
						width: 20 + random(index + 20) * 24,
						height: 8 + random(index + 30) * 8,
						borderRadius: '100% 0 100% 0',
						background: index % 3 === 0 ? '#b78b38' : '#314b2d',
						opacity: 0.35 + random(index + 10) * 0.45,
						transform: `rotate(${rotation}deg)`,
						boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
					}}
				/>
			);
		})}
	</div>
);
