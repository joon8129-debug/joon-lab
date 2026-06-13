#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const targets = [];
for (const pkg of fs.readdirSync(path.join(root, 'packages'))) {
  const src = path.join(root, 'packages', pkg, 'src');
  if (!fs.existsSync(src)) continue;
  for (const file of fs.readdirSync(src)) {
    if (file.endsWith('.js')) targets.push(path.join(src, file));
  }
}
targets.push(path.join(root, 'test', 'modules.smoke.js'));
for (const file of targets) {
  const out = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (out.status !== 0) process.exit(out.status);
}
console.log(`module syntax ok: ${targets.length} files`);
