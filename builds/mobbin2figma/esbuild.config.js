const esbuild = require('esbuild');
const fs = require('fs');

async function build() {
  fs.mkdirSync('dist', { recursive: true });

  await esbuild.build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    outfile: 'dist/main.js',
    platform: 'browser',
    target: ['es6'],
  });

  await esbuild.build({
    entryPoints: ['src/ui.ts'],
    bundle: true,
    outfile: 'dist/ui.js',
    platform: 'browser',
    target: ['es6'],
  });

  const js = fs.readFileSync('dist/ui.js', 'utf8');
  const htmlTemplate = fs.readFileSync('src/ui.html', 'utf8');
  const injected = htmlTemplate.replace('</body>', `<script>${js}</script></body>`);
  if (injected === htmlTemplate) throw new Error('src/ui.html is missing </body> — JS not injected');
  fs.writeFileSync('dist/ui.html', injected);
  fs.unlinkSync('dist/ui.js');

  console.log('Build complete');
}

build().catch(err => { console.error(err); process.exit(1); });
