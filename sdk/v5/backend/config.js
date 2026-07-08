import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

function load_config() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const configPath = resolve(__dirname, './config.json');
    const raw = readFileSync(configPath, 'utf-8');
    return JSON.parse(raw);
}

export { load_config };