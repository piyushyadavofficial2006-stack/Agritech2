const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

const repoDir = path.resolve(__dirname, '..');

// Helper to recursively collect files respecting .gitignore
function getFiles(dir, baseDir = dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === '.git' || file === 'node_modules' || file === 'dist' || file === '.env' || file === 'test-admin-security.js' || file === 'test-iso.js' || file === 'test-e2e-all.js') {
      continue;
    }
    const fullPath = path.join(dir, file);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, baseDir));
    } else {
      results.push(relPath);
    }
  }
  return results;
}

async function initRepo() {
  console.log('1. Initializing Git repository in:', repoDir);
  await git.init({ fs, dir: repoDir, defaultBranch: 'main' });

  console.log('2. Staging files...');
  const files = getFiles(repoDir);
  for (const filepath of files) {
    await git.add({ fs, dir: repoDir, filepath });
  }
  console.log(`- Staged ${files.length} project files.`);

  console.log('3. Creating Initial Commit...');
  const sha = await git.commit({
    fs,
    dir: repoDir,
    message: 'Initial commit: AgriTech Smart Farming Management System',
    author: {
      name: 'AgriTech Developer',
      email: 'developer@agritech.com'
    }
  });

  console.log('SUCCESS! Repository initialized with commit SHA:', sha);
  console.log('Default branch: main');
}

initRepo().catch((err) => {
  console.error('Git error:', err);
  process.exit(1);
});
