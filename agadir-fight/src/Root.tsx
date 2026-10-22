import {Composition} from 'remotion';
import {AgadirFight} from './AgadirFight';

export const RemotionRoot: React.FC = () => (
	<Composition
		id="AgadirFight"
		component={AgadirFight}
		durationInFrames={720}
		fps={24}
		width={1920}
		height={1080}
	/>
);
