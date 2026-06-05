const fs = require('fs');
try {
  console.log(fs.readFileSync('lib/rules/utils/code-path-utils.js', 'utf8'));
} catch (e) {
  console.error(e);
}
