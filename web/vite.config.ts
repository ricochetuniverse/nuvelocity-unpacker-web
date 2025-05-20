import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
	base: 'https://ricochetuniverse.github.io/nuvelocity-unpacker-web/',
	plugins: [react()],
});
