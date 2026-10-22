import {execFileSync, spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {brotliDecompressSync} from 'node:zlib';
import Chromium from '@sparticuz/chromium';

const root = path.dirname(fileURLToPath(import.meta.url));
const executablePath = await Chromium.executablePath();
const still = process.argv.includes('--still');
await mkdir(path.join(root, 'out'), {recursive: true});

// The npm Chromium package includes its NSS runtime for Amazon Linux. Those
// libraries are also compatible with Debian and avoid a system apt install.
const libraryRoot = path.join(tmpdir(), 'al2023');
const libraryPath = path.join(libraryRoot, 'lib');
if (process.platform === 'linux' && !existsSync(path.join(libraryPath, 'libnspr4.so'))) {
	await mkdir(libraryRoot, {recursive: true});
	const packed = await readFile(
		path.join(root, 'node_modules', '@sparticuz', 'chromium', 'bin', 'al2023.tar.br'),
	);
	const archive = path.join(tmpdir(), 'agadir-al2023.tar');
	await writeFile(archive, brotliDecompressSync(packed));
	execFileSync('tar', ['-xf', archive, '-C', libraryRoot]);
}

const args = still
	? [
			'still',
			'src/index.ts',
			'AgadirFight',
			'out/agadir-poster.png',
			'--frame=640',
			`--browser-executable=${executablePath}`,
		]
	: [
			'render',
			'src/index.ts',
			'AgadirFight',
			'out/agadir-infinity-bankai.mp4',
			`--browser-executable=${executablePath}`,
			'--concurrency=2',
		];

const cli = path.join(root, 'node_modules', '.bin', 'remotion');
const child = spawn(cli, args, {
	cwd: root,
	stdio: 'inherit',
	env: {
		...process.env,
		LD_LIBRARY_PATH: [libraryPath, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':'),
	},
});
child.on('exit', (code) => process.exit(code ?? 1));
