import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {AerialBackground, CoastBackground, WindLeaves} from '../components/Environment';
import {Fighter, GroundShadow} from '../components/Fighter';
import {
	EnergyOrb,
	ImpactFlash,
	InkAura,
	ParticleBurst,
	SpeedLines,
	TechniqueTitle,
} from '../components/Effects';
import {fade, progress, random, shake} from '../lib/animation';

export const RevealScene: React.FC = () => {
	const frame = useCurrentFrame();
	if (frame < 24) {
		const leap = progress(frame, 0, 23, Easing.out(Easing.cubic));
		const arc = Math.sin(leap * Math.PI) * 170;
		return (
			<AbsoluteFill style={{overflow: 'hidden', background: '#132936'}}>
				<CoastBackground frame={frame} scale={1.09} dark={0.12} />
				<WindLeaves frame={frame} count={14} />
				<GroundShadow left={480 - leap * 140} bottom={36} width={440 * (1 - arc / 400)} opacity={0.35 - arc / 800} />
				<GroundShadow left={1410 + leap * 130} bottom={36} width={300 * (1 - arc / 400)} opacity={0.35 - arc / 800} />
				<Fighter pose="shunsui-stance" left={310 - leap * 150} bottom={28 + arc} height={860} transform={`rotate(${-leap * 7}deg)`} />
				<Fighter pose="gojo-stance" left={1300 + leap * 160} bottom={28 + arc} height={870} transform={`rotate(${leap * 6}deg)`} />
				<SpeedLines frame={frame} mode="horizontal" opacity={0.22} count={44} />
			</AbsoluteFill>
		);
	}

	if (frame < 62) {
		const local = frame - 24;
		const remove = progress(local, 7, 18, Easing.in(Easing.cubic));
		const revealed = progress(local, 10, 22);
		return (
			<AbsoluteFill style={{overflow: 'hidden', background: '#030b17'}}>
				<Img
					src={staticFile('gojo-reference.jpg')}
					style={{
						position: 'absolute',
						inset: 0,
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						objectPosition: '50% 38%',
						transform: `scale(${1.025 + local * 0.0018}) translateY(${-local * 0.45}px)`,
						filter: `saturate(${0.75 + revealed * 0.55}) contrast(1.08) brightness(${0.66 + revealed * 0.25})`,
					}}
				/>
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,9,25,0.58), transparent 42%, rgba(0,9,25,0.15))'}} />
				<SpeedLines frame={frame} color="#69eaff" opacity={0.1 + revealed * 0.2} count={64} />
				{[650, 1245].map((x, index) => (
					<div
						key={x}
						style={{
							position: 'absolute',
							left: x - 170,
							top: 430 + index * 8,
							width: 340,
							height: 340,
							borderRadius: '50%',
							background: 'radial-gradient(circle, rgba(170,255,255,0.8) 0%, rgba(0,218,255,0.3) 18%, transparent 67%)',
							opacity: revealed * (0.65 + Math.sin(frame * 0.5) * 0.12),
							mixBlendMode: 'screen',
							filter: 'blur(5px)',
						}}
					/>
				))}
				<div
					style={{
						position: 'absolute',
						left: 250,
						top: 450,
						width: 1420,
						height: 360,
						background: 'radial-gradient(ellipse at 50% 15%, #1c2636 0%, #080d16 42%, #02050b 78%, #111a29 100%)',
						clipPath: 'polygon(1% 23%, 12% 7%, 50% 0%, 88% 8%, 99% 25%, 96% 74%, 84% 92%, 48% 100%, 10% 88%, 0% 66%)',
						boxShadow: '0 20px 35px rgba(0,0,0,0.65)',
						opacity: 1 - progress(local, 14, 19),
						transform: `translate(${remove * 420}px, ${-remove * 850}px) rotate(${-3 + remove * 32}deg)`,
					}}
				/>
				<TechniqueTitle title="Six Eyes" subtitle="No more blindfold" frame={local} start={18} color="#9bf4ff" />
				<AbsoluteFill style={{background: '#020713', opacity: 1 - fade(local, 0, 4)}} />
			</AbsoluteFill>
		);
	}

	const local = frame - 62;
	const aura = progress(local, 0, 38, Easing.out(Easing.cubic));
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#05050d'}}>
			<CoastBackground frame={frame} scale={1.14 + local * 0.0008} x={-80} dark={0.52 + aura * 0.16} tint="rgba(44,13,58,0.35)" />
			<InkAura frame={frame} x={940} y={990} scale={1.2 + aura * 1.5} intensity={0.3 + aura * 0.7} />
			<SpeedLines frame={frame} color="#7f569a" opacity={aura * 0.2} count={72} />
			<Fighter
				pose="shunsui-stance"
				left={600}
				bottom={-12}
				height={1060}
				transform={`translateY(${(1 - aura) * 45}px)`}
				filter={`drop-shadow(0 0 ${25 + aura * 35}px rgba(236,135,180,0.22)) drop-shadow(0 25px 24px rgba(0,0,0,0.7)) brightness(${0.7 + aura * 0.2})`}
			/>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: 'radial-gradient(ellipse at 50% 80%, transparent 15%, rgba(2,2,9,0.25) 48%, rgba(2,2,9,0.82) 100%)',
				}}
			/>
			<TechniqueTitle title="Bankai" subtitle="Katen Kyōkotsu · Karamatsu Shinjū" frame={local} start={10} align="right" color="#efc0d5" />
			<ImpactFlash frame={local} start={0} color="#2b183c" duration={7} strength={0.85} />
		</AbsoluteFill>
	);
};

export const ChargeScene: React.FC = () => {
	const frame = useCurrentFrame();
	const charge = progress(frame, 0, 82, Easing.in(Easing.cubic));
	const merge = progress(frame, 8, 37, Easing.inOut(Easing.cubic));
	const cameraShake = shake(frame, charge * 6);
	const orbSize = 25 + progress(frame, 20, 80, Easing.out(Easing.cubic)) * 290;
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#090918'}}>
			<AbsoluteFill style={{transform: `translate(${cameraShake.x}px, ${cameraShake.y}px) scale(${1.13 - charge * 0.09})`}}>
				<CoastBackground frame={frame} scale={1.08} dark={0.36 + charge * 0.2} tint="rgba(66,29,125,0.3)" />
				<InkAura frame={frame} x={560} y={1000} scale={1.5 + charge * 1.25} intensity={0.7 + charge * 0.3} />
				<GroundShadow left={1450} bottom={30} width={390} color="#31125c" opacity={0.65} />
				<Fighter pose="shunsui-stance" left={170} bottom={20} height={950} filter="drop-shadow(0 0 28px rgba(230,141,181,0.25)) drop-shadow(0 24px 22px rgba(0,0,0,0.65))" />
				<Fighter pose="gojo-ultimate" left={1260} bottom={24} height={950} filter="drop-shadow(0 0 32px rgba(130,90,255,0.42)) drop-shadow(0 24px 22px rgba(0,0,0,0.6))" />
				<EnergyOrb frame={frame} x={interpolate(merge, [0, 1], [1360, 1442])} y={interpolate(merge, [0, 1], [280, 338])} size={85 * (1 - merge * 0.45)} color="#ff244c" secondary="#ffb5c1" opacity={1 - progress(frame, 34, 43)} />
				<EnergyOrb frame={-frame} x={interpolate(merge, [0, 1], [1535, 1442])} y={interpolate(merge, [0, 1], [280, 338])} size={85 * (1 - merge * 0.45)} color="#25cfff" secondary="#c3f8ff" opacity={1 - progress(frame, 34, 43)} />
				<EnergyOrb frame={frame} x={1442} y={338} size={orbSize} color="#a841ff" secondary="#e6b8ff" opacity={progress(frame, 25, 36)} />
				<svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}>
					{[0, 1, 2].map((ring) => (
						<circle
							key={ring}
							cx="1442"
							cy="338"
							r={80 + ((frame * 9 + ring * 130) % 390)}
							fill="none"
							stroke={ring % 2 ? '#c584ff' : '#77dcff'}
							strokeWidth={5 - ring}
							opacity={charge * (1 - ((frame * 9 + ring * 130) % 390) / 390) * 0.65}
						/>
					))}
					{new Array(12).fill(null).map((_, index) => {
						const angle = (index / 12) * Math.PI * 2 + frame * 0.02;
						const inner = orbSize * 0.35;
						const outer = inner + 90 + random(index + 4) * 140;
						return (
							<line
								key={index}
								x1={1442 + Math.cos(angle) * inner}
								y1={338 + Math.sin(angle) * inner}
								x2={1442 + Math.cos(angle + 0.08) * outer}
								y2={338 + Math.sin(angle + 0.08) * outer}
								stroke={index % 2 ? '#dfb0ff' : '#7bdfff'}
								strokeWidth={2 + random(index) * 4}
								opacity={charge * 0.7}
							/>
						);
					})}
				</svg>
				<ParticleBurst frame={frame} start={52} originX={1442} originY={338} count={48} color="#c45cff" secondary="#a9eeff" power={420} duration={55} />
			</AbsoluteFill>
			<TechniqueTitle title="Hollow Purple" subtitle="Imaginary mass · maximum output" frame={frame} start={24} align="right" color="#deb0ff" />
			<ImpactFlash frame={frame} start={88} color="#a13cff" duration={8} strength={0.7} />
		</AbsoluteFill>
	);
};

export const FinaleScene: React.FC = () => {
	const frame = useCurrentFrame();
	const approach = progress(frame, 0, 40, Easing.inOut(Easing.cubic));
	const collision = progress(frame, 41, 76, Easing.out(Easing.cubic));
	const after = progress(frame, 76, 108);
	const cameraShake = shake(frame, frame >= 41 ? 42 * (1 - progress(frame, 42, 101)) : approach * 3);
	const purpleX = interpolate(approach, [0, 1], [1480, 980]);
	const purpleY = interpolate(approach, [0, 1], [760, 480]);
	const blackX = interpolate(approach, [0, 1], [520, 900]);
	const blackY = interpolate(approach, [0, 1], [790, 500]);
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#101229'}}>
			<AbsoluteFill
				style={{
					transform: `translate(${cameraShake.x}px, ${cameraShake.y}px) rotate(${cameraShake.rotate}deg) scale(${1.24 - progress(frame, 0, 44) * 0.22 + collision * 0.04})`,
				}}
			>
				<AerialBackground frame={frame} scale={1.02} dark={0.08 + approach * 0.18} />
				<svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
					<defs>
						<linearGradient id="purple-trail" gradientUnits="userSpaceOnUse" x1="1500" y1="850" x2="950" y2="450">
							<stop offset="0%" stopColor="#5d19b5" stopOpacity="0" />
							<stop offset="55%" stopColor="#b14dff" />
							<stop offset="100%" stopColor="#ffffff" />
						</linearGradient>
					</defs>
					<path d={`M 1580 920 L ${purpleX} ${purpleY}`} stroke="url(#purple-trail)" strokeWidth={55 + approach * 85} strokeLinecap="round" opacity={0.55 * (1 - collision)} />
					{new Array(13).fill(null).map((_, index) => {
						const startX = 250 + index * 45;
						const startY = 990 - index * 18;
						const sway = Math.sin(frame * 0.09 + index) * 80;
						return (
							<path
								key={index}
								d={`M ${startX} ${startY} C ${startX + 150} ${startY - 280}, ${blackX - 220 + sway} ${blackY + 170}, ${blackX} ${blackY}`}
								fill="none"
								stroke={index % 3 === 0 ? '#301345' : '#070611'}
								strokeWidth={35 + random(index) * 55}
								strokeLinecap="round"
								opacity={0.65 + approach * 0.3}
							/>
						);
					})}
				</svg>
				<InkAura frame={frame} x={blackX} y={blackY + 100} scale={1.6 + approach * 0.8} intensity={0.82} />
				<EnergyOrb frame={frame} x={purpleX} y={purpleY} size={150 + approach * 260} color="#a63cff" secondary="#e7c1ff" />
				{frame >= 38 ? (
					<>
						<div
							style={{
								position: 'absolute',
								left: 960 - (120 + collision * 1900) / 2,
								top: 480 - (120 + collision * 1900) / 2,
								width: 120 + collision * 1900,
								height: 120 + collision * 1900,
								borderRadius: '50%',
								background: 'radial-gradient(circle, #ffffff 0%, #f2d9ff 8%, #b858ff 22%, rgba(91,23,155,0.72) 40%, rgba(32,8,55,0.25) 62%, transparent 72%)',
								opacity: (0.4 + collision * 0.6) * (1 - after),
								mixBlendMode: 'screen',
								filter: `blur(${2 + collision * 8}px)`,
							}}
						/>
						<svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible', mixBlendMode: 'screen'}}>
							{[0, 1, 2, 3].map((ring) => {
								const ringProgress = progress(frame, 42 + ring * 4, 96 + ring * 3, Easing.out(Easing.cubic));
								return (
									<ellipse
										key={ring}
										cx="960"
										cy="500"
										rx={ringProgress * (1000 + ring * 240)}
										ry={ringProgress * (420 + ring * 90)}
										fill="none"
										stroke={ring % 2 ? '#dcaeff' : '#ffffff'}
										strokeWidth={Math.max(1, 20 - ringProgress * 17)}
										opacity={(1 - ringProgress) * 0.85}
									/>
								);
							})}
						</svg>
						<SpeedLines frame={frame} color="#e4c5ff" opacity={(1 - after) * 0.7} count={100} />
						<ParticleBurst frame={frame} start={41} originX={960} originY={480} count={135} color="#b85cff" secondary="#ffffff" power={1600} duration={67} />
					</>
				) : null}
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: 'radial-gradient(circle at 50% 45%, rgba(255,225,255,0.8), rgba(152,70,255,0.24) 38%, transparent 75%)',
						opacity: collision * (1 - after),
						mixBlendMode: 'screen',
					}}
				/>
			</AbsoluteFill>
			<ImpactFlash frame={frame} start={41} color="#ffffff" duration={9} strength={1} />
			<ImpactFlash frame={frame} start={48} color="#a841ff" duration={13} strength={0.5} />
		</AbsoluteFill>
	);
};

export const AftermathScene: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#0a1320'}}>
			<AerialBackground frame={frame} scale={1.01 + frame * 0.0006} dark={0.08 + frame * 0.002} />
			<svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}>
				<ellipse cx="960" cy="500" rx={220 + frame * 30} ry={90 + frame * 12} fill="none" stroke="#d7b4ff" strokeWidth={Math.max(1, 12 - frame * 0.25)} opacity={0.5 * (1 - frame / 36)} />
			</svg>
			{new Array(9).fill(null).map((_, index) => {
				const size = 140 + random(index) * 240;
				return (
					<div
						key={index}
						style={{
							position: 'absolute',
							left: 680 + random(index + 10) * 570 + Math.sin(frame * 0.04 + index) * 35,
							top: 350 + random(index + 20) * 300 - frame * (2 + random(index) * 3),
							width: size,
							height: size,
							borderRadius: '50%',
							background: index % 2 ? 'radial-gradient(circle, rgba(157,74,255,0.25), transparent 68%)' : 'radial-gradient(circle, rgba(20,10,35,0.55), transparent 68%)',
							filter: 'blur(14px)',
							opacity: 0.75 - frame * 0.012,
						}}
					/>
				);
			})}
			<div
				style={{
					position: 'absolute',
					left: 82,
					bottom: 84,
					color: '#fff2df',
					fontFamily: 'Arial, Helvetica, sans-serif',
					fontSize: 14,
					letterSpacing: 7,
					opacity: 0.58 * (1 - progress(frame, 20, 32)),
				}}
			>
				AGADIR BAY / ATLANTIC OCEAN
			</div>
			<AbsoluteFill style={{background: '#02040a', opacity: progress(frame, 23, 36, Easing.in(Easing.cubic))}} />
		</AbsoluteFill>
	);
};
