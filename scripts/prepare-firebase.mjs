import assert from 'node:assert/strict';
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const project = 'bestgym-pt';
const mode = process.argv[2] ?? 'all';
assert.ok(['all', 'hosting', 'functions'].includes(mode), 'Expected hosting, functions or all');
const [rc, config] = await Promise.all(['.firebaserc', 'firebase.json'].map(async name => JSON.parse(await readFile(name, 'utf8'))));
assert.equal(rc.projects.default, project);
assert.deepEqual(rc.targets[project].hosting, { bestgym: ['bestgym'] });
assert.equal(config.hosting.length, 1);
assert.equal(config.hosting[0].target, 'bestgym');
assert.equal(config.hosting[0].public, 'public');
assert.ok(!config.hosting[0].site, 'Use the explicit Hosting target');
if (process.env.GCLOUD_PROJECT) assert.equal(process.env.GCLOUD_PROJECT, project);

if (mode !== 'functions') await import('./generate-localized-pages.mjs');
if (mode !== 'hosting') {
  // Functions deployments package only their source directory. Copy the exact
  // live handler and schema at build time, without a second maintained copy.
  for (const file of ['api/leads.js', 'lib/lead-handler.cjs', 'lead-config.js']) {
    const destination = resolve('functions', 'shared', file);
    await mkdir(dirname(destination), { recursive: true });
    await copyFile(file, destination);
  }
  console.log('Prepared shared lead handler for Functions.');
}
