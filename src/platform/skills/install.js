#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Manage AI coding skills for vets-website.
 *
 * Skills are defined once in src/platform/skills/ using the Agent Skills open
 * standard (SKILL.md with YAML frontmatter) and symlinked into your AI tool's
 * config directory.
 *
 * Usage:
 *   yarn skills                              Interactive mode
 *   yarn skills install cypress claude       Install one skill for Claude
 *   yarn skills install all claude           Install all skills for Claude
 *   yarn skills install cypress claude,copilot  Install for multiple targets
 *   yarn skills uninstall cypress claude     Remove one skill from Claude
 *   yarn skills uninstall all claude         Remove all skills from Claude
 *   yarn skills list                         Show available skills and status
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const SKILLS_DIR = path.resolve(__dirname);
const REPO_ROOT = path.resolve(__dirname, '../../..');

const TARGETS = {
  claude: {
    label: 'Claude Code',
    dirs: [
      path.join(REPO_ROOT, '.claude', 'skills'),
      path.join(os.homedir(), '.claude', 'skills'),
    ],
  },
  copilot: {
    label: 'GitHub Copilot',
    dirs: [path.join(REPO_ROOT, '.github', 'skills')],
  },
  cursor: {
    label: 'Cursor',
    dirs: [path.join(REPO_ROOT, '.cursor', 'skills')],
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getSkills() {
  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(
      e =>
        e.isDirectory() &&
        fs.existsSync(path.join(SKILLS_DIR, e.name, 'SKILL.md')),
    )
    .map(e => {
      const content = fs.readFileSync(
        path.join(SKILLS_DIR, e.name, 'SKILL.md'),
        'utf-8',
      );
      const descMatch = content.match(/^description:\s*(.+)$/m);
      return { name: e.name, description: descMatch ? descMatch[1] : '' };
    });
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function isSymlink(p) {
  try {
    return fs.lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

function getInstalledSkills(targetKey) {
  const { dirs } = TARGETS[targetKey];
  const skills = getSkills();
  return skills.filter(s => dirs.some(d => isSymlink(path.join(d, s.name))));
}

function promptQuestion(rl, question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

function resolveSkills(skillArg) {
  const allSkills = getSkills();
  if (skillArg === 'all') return allSkills;

  const names = skillArg.split(',').map(s => s.trim());
  const resolved = [];
  for (const name of names) {
    const found = allSkills.find(s => s.name === name);
    if (!found) {
      console.error(`  Unknown skill: ${name}`);
      console.error(
        `  Available: ${allSkills.map(s => s.name).join(', ')}`,
      );
      process.exit(1);
    }
    resolved.push(found);
  }
  return resolved;
}

function resolveTargets(targetArg) {
  if (targetArg === 'all') return Object.keys(TARGETS);

  const keys = targetArg.split(',').map(t => t.trim());
  for (const key of keys) {
    if (!TARGETS[key]) {
      console.error(`  Unknown target: ${key}`);
      console.error(`  Available: ${Object.keys(TARGETS).join(', ')}`);
      process.exit(1);
    }
  }
  return keys;
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

function listSkills() {
  const skills = getSkills();
  if (skills.length === 0) {
    console.log('\n  No skills found in src/platform/skills/\n');
    return;
  }

  console.log(`\n  Available skills (${skills.length}):\n`);

  const targetKeys = Object.keys(TARGETS);

  for (const skill of skills) {
    console.log(`    ${skill.name}`);
    if (skill.description) console.log(`      ${skill.description}`);

    const installedIn = targetKeys.filter(key =>
      TARGETS[key].dirs.some(d => isSymlink(path.join(d, skill.name))),
    );

    if (installedIn.length > 0) {
      console.log(
        `      \u2713 installed: ${installedIn.map(k => TARGETS[k].label).join(', ')}`,
      );
    } else {
      console.log('      - not installed');
    }
  }
  console.log('');
}

function installSkills(skills, targetKeys) {
  let installed = 0;

  for (const key of targetKeys) {
    const target = TARGETS[key];

    for (const dir of target.dirs) {
      for (const skill of skills) {
        const src = path.join(SKILLS_DIR, skill.name);
        const dest = path.join(dir, skill.name);

        ensureDir(dir);

        if (isSymlink(dest)) {
          fs.unlinkSync(dest);
        } else if (fs.existsSync(dest)) {
          console.log(`  SKIP ${dest} (not a symlink)`);
          continue;
        }

        fs.symlinkSync(src, dest, 'dir');
        console.log(
          `  ${target.label}: ${skill.name} -> ${path.relative(REPO_ROOT, dest)}`,
        );
        installed += 1;
      }
    }
  }

  console.log(`\n  Done. ${installed} symlink(s) created.\n`);
}

function uninstallSkills(skills, targetKeys) {
  let removed = 0;

  for (const key of targetKeys) {
    const target = TARGETS[key];

    for (const dir of target.dirs) {
      for (const skill of skills) {
        const dest = path.join(dir, skill.name);
        if (isSymlink(dest)) {
          fs.unlinkSync(dest);
          console.log(`  Removed ${target.label}: ${skill.name}`);
          removed += 1;
        }
      }
    }
  }

  console.log(`\n  Done. ${removed} symlink(s) removed.\n`);
}

// ---------------------------------------------------------------------------
// Interactive mode
// ---------------------------------------------------------------------------

async function interactive() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const skills = getSkills();
  console.log('\n  AI Skills Manager');
  console.log('  =================\n');

  if (skills.length === 0) {
    console.log('  No skills found in src/platform/skills/\n');
    rl.close();
    return;
  }

  // Show skills with install status
  const targetKeys = Object.keys(TARGETS);
  for (const skill of skills) {
    const installedIn = targetKeys.filter(key =>
      TARGETS[key].dirs.some(d => isSymlink(path.join(d, skill.name))),
    );
    const status =
      installedIn.length > 0
        ? `\u2713 ${installedIn.map(k => k).join(', ')}`
        : '-';
    console.log(`    ${status}  ${skill.name} — ${skill.description}`);
  }

  console.log('\n  What would you like to do?\n');
  console.log('    1) Install skills');
  console.log('    2) Uninstall skills');
  console.log('    3) List details');
  console.log('    q) Quit\n');

  const choice = await promptQuestion(rl, '  > ');

  if (choice === 'q' || choice === '') {
    rl.close();
    return;
  }

  if (choice === '3') {
    listSkills();
    rl.close();
    return;
  }

  const action = choice === '2' ? 'uninstall' : 'install';

  // Pick skills
  console.log(`\n  Which skill(s)? (comma-separated, or "all")\n`);
  for (const skill of skills) {
    console.log(`    ${skill.name}`);
  }
  console.log('    all\n');

  const skillInput = await promptQuestion(rl, '  > ');
  if (!skillInput || skillInput === 'q') {
    rl.close();
    return;
  }

  // Pick targets
  const targetEntries = Object.entries(TARGETS);
  console.log(`\n  Which target(s)? (comma-separated, or "all")\n`);
  for (const [key, target] of targetEntries) {
    console.log(`    ${key} — ${target.label}`);
  }
  console.log('    all\n');

  const targetInput = await promptQuestion(rl, '  > ');
  rl.close();

  if (!targetInput || targetInput === 'q') return;

  const selectedSkills = resolveSkills(skillInput);
  const selectedTargets = resolveTargets(targetInput);

  console.log('');
  if (action === 'uninstall') {
    uninstallSkills(selectedSkills, selectedTargets);
  } else {
    installSkills(selectedSkills, selectedTargets);
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  interactive();
} else if (command === 'list') {
  listSkills();
} else if (command === 'install' && args[1] && args[2]) {
  installSkills(resolveSkills(args[1]), resolveTargets(args[2]));
} else if (command === 'uninstall' && args[1] && args[2]) {
  uninstallSkills(resolveSkills(args[1]), resolveTargets(args[2]));
} else {
  console.log(`
  Usage:
    yarn skills                              Interactive mode
    yarn skills install <skill> <target>     Install skill for target
    yarn skills install all claude           Install all skills for Claude
    yarn skills install cypress claude,copilot  Install for multiple targets
    yarn skills uninstall cypress claude     Remove one skill from Claude
    yarn skills uninstall all claude         Remove all from Claude
    yarn skills list                         Show skills and status

  Skills:  ${getSkills().map(s => s.name).join(', ') || '(none)'}
  Targets: ${Object.keys(TARGETS).join(', ')}
  `);
}
