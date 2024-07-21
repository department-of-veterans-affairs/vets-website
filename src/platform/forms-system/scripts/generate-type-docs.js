#!/usr/bin/env node
/* eslint-disable no-console */
const path = require('path');
const open = require('open');
const { exec } = require('child_process');

exec('yarn jsdoc -c jsdoc.json || true', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error generating docs: ${error}`);
    return;
  }

  console.log(`Docs generated: ${stdout}`);
  console.error(`Docs generation errors: ${stderr}`);

  open(path.join('docs', 'types', 'index.html'));
});
