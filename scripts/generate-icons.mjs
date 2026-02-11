import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const svgPath = join(root, 'src/app/icon.svg');
const svg = readFileSync(svgPath);

const sizes = [
  { name: 'icon-192x192.png', size: 192, dest: 'public' },
  { name: 'icon-512x512.png', size: 512, dest: 'public' },
  { name: 'apple-icon.png', size: 180, dest: 'src/app' },
];

for (const { name, size, dest } of sizes) {
  const outPath = join(root, dest, name);
  await sharp(svg).resize(size, size).png().toFile(outPath);
  console.log(`Generated: ${dest}/${name} (${size}x${size})`);
}

// Generate favicon.ico (32x32 PNG as ico replacement)
const faviconPath = join(root, 'src/app/favicon.ico');
await sharp(svg).resize(32, 32).png().toFile(faviconPath.replace('.ico', '.png'));

// Create a proper ICO-like file (actually a 32x32 PNG - browsers accept this)
const pngBuf = await sharp(svg).resize(32, 32).png().toBuffer();
writeFileSync(faviconPath, pngBuf);
console.log('Generated: src/app/favicon.ico (32x32)');

console.log('Done!');
