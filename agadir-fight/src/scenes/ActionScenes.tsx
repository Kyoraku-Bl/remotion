import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {CoastBackground, WindLeaves} from '../components/Environment';
import {Fighter, GroundShadow} from '../components/Fighter';
import {
	EnergyOrb,
	ImpactFlash,
	InfinityBarrier,
	InkAura,
	ParticleBurst,
	SpeedLines,
	TechniqueTitle,
} from '../components/Effects';
import {fade, progress, shake} from '../lib/animation';

export const StandoffScene: React.FC = () => {
	const frame = useCurrentFrame();
	const camera = 1.015 + frame * 0.00055;
	const titleOpacity = Math.min(fade(frame, 8, 20), 1 - progress(frame, 62, 78));
	return (
		<AbsoluteFill style={{background: '#142b36', overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${camera})`}}>
				<CoastBackground frame={frame} scale={1.025} dark={0.025} />
				<GroundShadow left={560} bottom={42} width={530} />
				<GroundShadow left={1440} bottom={42} width={330} />
				<Fighter
					pose="shunsui-stance"
					left={275}
					bottom={26}
					height={860}
					transform={`translateY(${Math.sin(frame * 0.09) * 3}px) rotate(${Math.sin(frame * 0.045) * 0.2}deg)`}
				/>
				<Fighter
					pose="gojo-stance"
					left={1320}
					bottom={30}
					height={850}
					transform={`translateY(${Math.sin(frame * 0.085 + 2) * 3}px)`}
				/>
			</AbsoluteFill>
			<WindLeaves frame={frame} />
			<div
				style={{
					position: 'absolute',
					left: -180,
					top: -260,
					width: 900,
					height: 900,
					background: 'radial-gradient(circle, rgba(255,211,129,0.25), transparent 66%)',
					mixBlendMode: 'screen',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: 94,
					top: 112,
					color: '#fff8e8',
					fontFamily: 'Arial, Helvetica, sans-serif',
					opacity: titleOpacity,
					transform: `translateY(${(1 - fade(frame, 8, 20)) * 18}px)`,
					textShadow: '0 3px 18px rgba(0,0,0,0.45)',
				}}
			>
				<div style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 15, letterSpacing: 6}}>
					<div style={{width: 58, height: 2, background: '#f3c77c'}} />
					30°25′ N · 9°36′ W
				</div>
				<div style={{fontSize: 64, fontWeight: 800, letterSpacing: 15, marginTop: 12}}>AGADIR</div>
				<div style={{fontSize: 17, letterSpacing: 8, marginTop: 4, opacity: 0.85}}>MOROCCO · GOLDEN HOUR</div>
			</div>
			<div
				style={{
					position: 'absolute',
					left: 96,
					bottom: 86,
					fontFamily: 'Arial, Helvetica, sans-serif',
					fontSize: 13,
					letterSpacing: 5,
					color: '#fff4dc',
					opacity: 0.55 * titleOpacity,
				}}
			>
				ATLANTIC COAST / 18:42
			</div>
			<AbsoluteFill style={{background: '#02050a', opacity: 1 - fade(frame, 0, 10)}} />
		</AbsoluteFill>
	);
};

export const InfinityScene: React.FC = () => {
	const frame = useCurrentFrame();
	if (frame < 22) {
		const dash = progress(frame, 3, 19, Easing.in(Easing.cubic));
		return (
			<AbsoluteFill style={{overflow: 'hidden', background: '#132936'}}>
				<CoastBackground frame={frame} scale={1.12} x={-70} dark={0.05} />
				<SpeedLines frame={frame} mode="horizontal" opacity={0.18 + dash * 0.65} count={70} />
				<GroundShadow left={1435} bottom={40} width={360} />
				<Fighter pose="gojo-stance" left={1300} bottom={28} height={875} />
				<Fighter
					pose={frame < 7 ? 'shunsui-stance' : 'shunsui-attack'}
					left={240 + dash * 570}
					bottom={28 + Math.sin(dash * Math.PI) * 70}
					height={frame < 7 ? 860 : 900}
					opacity={frame < 4 ? 1 : 0.78 + dash * 0.22}
					transform={`rotate(${dash * 5}deg) scaleX(${1 + dash * 0.16})`}
					filter={`drop-shadow(${-dash * 35}px 0 22px rgba(255,175,154,0.35)) drop-shadow(0 20px 18px rgba(0,0,0,0.4))`}
				/>
				{new Array(4).fill(null).map((_, index) => (
					<Fighter
						key={index}
						pose="shunsui-attack"
						left={160 + dash * 570 - index * 75}
						bottom={28}
						height={900}
						opacity={frame > 8 ? (0.1 - index * 0.018) * dash : 0}
						filter="brightness(0) saturate(0) blur(2px)"
					/>
				))}
			</AbsoluteFill>
		);
	}

	const hit = progress(frame, 22, 27);
	const decay = 1 - progress(frame, 24, 76);
	const cameraShake = shake(frame - 22, 19 * decay);
	const impact = hit * (0.5 + decay * 0.5);
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#081d29'}}>
			<AbsoluteFill
				style={{
					transform: `translate(${cameraShake.x}px, ${cameraShake.y}px) rotate(${cameraShake.rotate}deg) scale(${1.03 + hit * 0.035})`,
				}}
			>
				<CoastBackground frame={frame} scale={1.25} x={-120} y={-40} dark={0.18} tint="rgba(30,130,170,0.18)" />
				<SpeedLines frame={frame} opacity={0.36 * decay} count={78} />
				<Fighter
					pose="shunsui-attack"
					left={460}
					bottom={-35}
					height={1120}
					transform={`translateX(${-decay * 8}px)`}
					filter="drop-shadow(0 0 24px rgba(255,177,143,0.22)) drop-shadow(0 22px 20px rgba(0,0,0,0.5))"
				/>
				<Fighter pose="gojo-stance" left={1320} bottom={-8} height={1090} />
				<InfinityBarrier frame={frame} x={1470} y={405} size={690} impact={impact} />
				<svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}>
					<defs>
						<linearGradient id="slash-white">
							<stop offset="0%" stopColor="#ffd7b0" stopOpacity="0" />
							<stop offset="70%" stopColor="#fff" stopOpacity="0.85" />
							<stop offset="100%" stopColor="#a9f3ff" />
						</linearGradient>
					</defs>
					{[
						'M 420 850 Q 850 610 1180 280',
						'M 480 900 Q 900 760 1165 460',
						'M 640 810 Q 960 590 1195 340',
					].map((path, index) => (
						<path
							key={path}
							d={path}
							fill="none"
							stroke="url(#slash-white)"
							strokeWidth={10 - index * 2.5}
							strokeDasharray="1200"
							strokeDashoffset={(1 - hit) * 1200}
							opacity={0.5 + impact * 0.5}
						/>
					))}
				</svg>
				<ParticleBurst frame={frame} start={22} originX={1190} originY={365} count={48} color="#8eeeff" secondary="#ffffff" power={620} duration={48} />
			</AbsoluteFill>
			<ImpactFlash frame={frame} start={22} duration={7} strength={0.95} color="#d9faff" />
			<TechniqueTitle title="Infinity" subtitle="Limitless · the space between" frame={frame} start={31} color="#c7f7ff" />
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: 'radial-gradient(circle at 90% 45%, rgba(255,20,55,0.42), transparent 52%)',
					opacity: progress(frame, 82, 96),
					mixBlendMode: 'screen',
				}}
			/>
		</AbsoluteFill>
	);
};

export const RedScene: React.FC = () => {
	const frame = useCurrentFrame();
	const charge = progress(frame, 2, 31, Easing.out(Easing.cubic));
	const launch = progress(frame, 34, 45, Easing.in(Easing.quad));
	const fired = frame >= 34;
	const sink = progress(frame, 43, 59, Easing.in(Easing.cubic));
	const cameraShake = shake(frame, fired ? 21 * (1 - progress(frame, 36, 82)) : charge * 2);
	const orbX = 960 + launch * 940;
	const orbY = 356 + launch * 250;
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#1b101b'}}>
			<AbsoluteFill style={{transform: `translate(${cameraShake.x}px, ${cameraShake.y}px) scale(1.035)`}}>
				<CoastBackground frame={frame} scale={1.1} dark={0.12 + charge * 0.12} tint="rgba(190,0,42,0.22)" />
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: 'radial-gradient(circle at 49% 36%, rgba(255,20,52,0.48), transparent 45%)',
						opacity: charge,
						mixBlendMode: 'screen',
					}}
				/>
				<InkAura frame={frame} x={1470} y={940} scale={0.85 + sink * 0.55} intensity={0.25 + sink * 0.75} />
				<GroundShadow left={1460} bottom={35} width={520} opacity={0.4 * (1 - sink)} />
				<Fighter
					pose="shunsui-stance"
					left={1270}
					bottom={30}
					height={870}
					opacity={1 - progress(frame, 51, 60)}
					transform={`translateY(${sink * 95}px) scaleY(${1 - sink * 0.92})`}
				/>
				<Fighter
					pose="gojo-red"
					left={330}
					bottom={22}
					height={910}
					flip
					transform={`translateX(${launch * 28}px)`}
					filter="drop-shadow(0 0 28px rgba(255,34,66,0.3)) drop-shadow(0 22px 20px rgba(0,0,0,0.5))"
				/>
				{fired ? (
					<svg
						width="1920"
						height="1080"
						viewBox="0 0 1920 1080"
						style={{position: 'absolute', inset: 0, overflow: 'visible', filter: 'drop-shadow(0 0 22px #ff123f)', mixBlendMode: 'screen'}}
					>
						<defs>
							<linearGradient id="red-beam" gradientUnits="userSpaceOnUse" x1="930" y1="350" x2="1920" y2="700">
								<stop offset="0%" stopColor="#ffffff" />
								<stop offset="20%" stopColor="#ffafb0" />
								<stop offset="62%" stopColor="#ff123f" />
								<stop offset="100%" stopColor="#8c001f" stopOpacity="0.2" />
							</linearGradient>
						</defs>
						{[150, 92, 38, 10].map((width, index) => (
							<path
								key={width}
								d={`M 940 356 L ${orbX} ${orbY}`}
								fill="none"
								stroke={index === 3 ? '#ffffff' : 'url(#red-beam)'}
								strokeWidth={width * (0.45 + launch * 0.55)}
								strokeLinecap="round"
								opacity={index === 0 ? 0.18 : 0.5 + index * 0.12}
							/>
						))}
					</svg>
				) : null}
				<EnergyOrb
					frame={frame}
					x={orbX}
					y={orbY}
					size={(32 + charge * 170 + launch * 180) * (1 + Math.sin(frame * 0.65) * 0.04)}
					color="#ff123f"
					secondary="#ffb1ac"
				/>
				<ParticleBurst frame={frame} start={37} originX={1420} originY={850} count={95} color="#d9a85d" secondary="#fff0bd" power={1100} duration={58} />
				<ParticleBurst frame={frame} start={43} originX={1770} originY={790} count={70} color="#ff294d" secondary="#ffd68c" power={850} duration={50} />
				{fired ? <SpeedLines frame={frame} mode="horizontal" color="#ff9b9b" opacity={0.45} count={58} /> : null}
			</AbsoluteFill>
			<ImpactFlash frame={frame} start={36} color="#ff284c" duration={8} strength={0.68} />
			<TechniqueTitle title="Red" subtitle="Cursed technique reversal" frame={frame} start={7} align="right" color="#ff8b91" />
		</AbsoluteFill>
	);
};

export const ShadowScene: React.FC = () => {
	const frame = useCurrentFrame();
	const travel = progress(frame, 0, 24, Easing.inOut(Easing.cubic));
	const emerge = progress(frame, 20, 36, Easing.out(Easing.back()));
	const leap = progress(frame, 34, 57, Easing.out(Easing.cubic));
	const hit = progress(frame, 47, 51);
	const cameraShake = shake(frame - 47, frame >= 47 ? 20 * (1 - progress(frame, 48, 80)) : 0);
	const shadowX = interpolate(travel, [0, 1], [1480, 720]);
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#050914'}}>
			<AbsoluteFill style={{transform: `translate(${cameraShake.x}px, ${cameraShake.y}px) scale(1.04)`}}>
				<CoastBackground frame={frame} scale={1.13} x={-60} dark={0.38} tint="rgba(32,19,74,0.32)" />
				<InkAura frame={frame} x={shadowX} y={945} scale={1.15 + emerge * 0.4} intensity={0.9} />
				<Fighter
					pose="gojo-stance"
					left={1110}
					bottom={28}
					height={920}
					transform={`translateX(${hit * 42}px) rotate(${hit * 2}deg)`}
				/>
				{emerge > 0 ? (
					<Fighter
						pose="shunsui-attack"
						left={350}
						bottom={28 + Math.sin(leap * Math.PI) * 190}
						height={1020}
						opacity={Math.min(1, emerge * 1.8)}
						transform={`translateY(${(1 - emerge) * 330}px) scaleY(${0.25 + emerge * 0.75}) rotate(${(1 - leap) * -7}deg)`}
						filter="drop-shadow(0 0 28px rgba(159,119,255,0.25)) drop-shadow(0 24px 22px rgba(0,0,0,0.6))"
					/>
				) : null}
				{frame > 28 ? <SpeedLines frame={frame} color="#c8b9ff" opacity={0.32 + hit * 0.3} count={64} /> : null}
				{frame >= 45 ? <InfinityBarrier frame={frame} x={1140} y={400} size={580} impact={hit} /> : null}
				{frame >= 45 ? (
					<svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}>
						<path d="M 430 130 Q 760 250 920 430" fill="none" stroke="#f4f5ff" strokeWidth="13" strokeDasharray="900" strokeDashoffset={(1 - hit) * 900} />
						<path d="M 400 190 Q 700 330 910 500" fill="none" stroke="#9deeff" strokeWidth="5" strokeDasharray="900" strokeDashoffset={(1 - hit) * 900} />
					</svg>
				) : null}
				<ParticleBurst frame={frame} start={47} originX={930} originY={430} count={55} color="#a4efff" secondary="#ffffff" power={700} duration={40} />
			</AbsoluteFill>
			<ImpactFlash frame={frame} start={47} color="#e4faff" duration={6} strength={0.9} />
			<div
				style={{
					position: 'absolute',
					left: 90,
					top: 104,
					fontFamily: 'Arial, Helvetica, sans-serif',
					fontSize: 15,
					letterSpacing: 7,
					color: '#d7c8ff',
					opacity: Math.min(fade(frame, 8, 16), 1 - progress(frame, 52, 66)),
				}}
			>
				SHADOW / COUNTERATTACK
			</div>
		</AbsoluteFill>
	);
};
