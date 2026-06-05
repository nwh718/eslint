const { execSync } = require('child_process');
const fs = require('fs');
try {
  const status = execSync('git status', { encoding: 'utf8' });
  fs.writeFileSync('git_status.txt', status);
} catch (e) {
  fs.writeFileSync('git_status.txt', e.message);
}
