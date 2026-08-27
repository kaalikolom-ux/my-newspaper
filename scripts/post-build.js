const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', '.vercel', 'output', 'static');
const targetFile = path.join(targetDir, '.assetsignore');

try {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(targetFile, '_worker.js\n_worker.js/**\n', 'utf8');
  console.log('Successfully created .assetsignore in .vercel/output/static');
} catch (err) {
  console.error('Error creating .assetsignore:', err);
}
