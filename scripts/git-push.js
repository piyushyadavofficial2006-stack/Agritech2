const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

const repoDir = path.resolve(__dirname, '..');

async function pushToGitHub() {
  const args = process.argv.slice(2);
  const repoUrl = args[0];
  const token = args[1];

  if (!repoUrl) {
    console.log('Usage: node scripts/git-push.js <GitHub-Repo-URL> [GitHub-Personal-Access-Token]');
    console.log('Example: node scripts/git-push.js https://github.com/myusername/agritech.git ghp_xxxxxx');
    process.exit(1);
  }

  console.log(`Connecting remote origin: ${repoUrl}`);
  try {
    await git.addRemote({
      fs,
      dir: repoDir,
      remote: 'origin',
      url: repoUrl,
      force: true
    });
  } catch (e) {
    // remote might already exist
  }

  console.log('Pushing to GitHub (main branch)...');
  const pushResult = await git.push({
    fs,
    http,
    dir: repoDir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => {
      if (token) {
        return { username: token, password: '' };
      }
      return undefined;
    }
  });

  console.log('Successfully pushed to GitHub!', pushResult);
}

pushToGitHub().catch((err) => {
  console.error('Push error:', err.message);
  process.exit(1);
});
