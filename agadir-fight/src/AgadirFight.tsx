import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FilmFinish} from './components/Effects';
import {InfinityScene, RedScene, ShadowScene, StandoffScene} from './scenes/ActionScenes';
import {AftermathScene, ChargeScene, FinaleScene, RevealScene} from './scenes/FinalScenes';

export const AgadirFight: React.FC = () => {
	const frame = useCurrentFrame();
	return (
	<AbsoluteFill style={{backgroundColor: '#03060b'}}>
		<Audio src={staticFile('soundtrack.wav')} volume={0.88} />
		<Sequence from={0} durationInFrames={96}>
			<StandoffScene />
		</Sequence>
		<Sequence from={96} durationInFrames={96}>
			<InfinityScene />
		</Sequence>
		<Sequence from={192} durationInFrames={84}>
			<RedScene />
		</Sequence>
		<Sequence from={276} durationInFrames={84}>
			<ShadowScene />
		</Sequence>
		<Sequence from={360} durationInFrames={120}>
			<RevealScene />
		</Sequence>
		<Sequence from={480} durationInFrames={96}>
			<ChargeScene />
		</Sequence>
		<Sequence from={576} durationInFrames={108}>
			<FinaleScene />
		</Sequence>
		<Sequence from={684} durationInFrames={36}>
			<AftermathScene />
		</Sequence>
		<FilmFinish frame={frame} />
	</AbsoluteFill>
	);
};
