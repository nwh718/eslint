const { execSync } = require('child_process');
const fs = require('fs');
try {
  const status = execSync('git status', { encoding: 'utf8' });
  const diff = execSync('git diff', { encoding: 'utf8' });
  fs.writeFileSync('git_info.txt', status + '\n\n' + diff);
} catch (e) {
  fs.writeFileSync('git_info.txt', e.message);
}
