import fs from 'fs';
import path from 'path';
import process from 'process';

const ATTEST_PATH = './test/util/attest-deps/node_modules/attest/attest.js';
const ATTEST_RULES_PATH = './test/util/attest-deps/node_modules/attest-rules/VA_508_ATtest.json';

function printRules(scope, runner, heading, level, rules) {
  rules.forEach(rule => {
    const failures = rule.nodes.filter(node => node.failureSummary);

    if (!failures.length) {
      runner.assert.ok(true, `${scope} - ${rule.help}`);
    } else {
      const summary = failures.map(node => {
        const targets = node.target.join('\n\t');
        return `${node.failureSummary}:\n\t${targets}`;
      }).join(', ');

      runner.verify.fail(`${scope} [${rule.impact}] - ${rule.help}: ${summary}`);
    }
  });
}

function printResults(scope, runner, results) {
  [{
    attr: 'inapplicable',
    heading: 'N/A',
    level: 'log'
  }, {
    attr: 'passes',
    heading: 'Passed',
    level: 'log'
  }, {
    attr: 'incomplete',
    heading: 'Insufficient Information',
    level: 'warn'
  }, {
    attr: 'violations',
    heading: 'Failures',
    level: 'error'
  }].forEach(conf => {
    if (results[conf.attr] && results[conf.attr].length) {
      printRules(scope, runner, conf.heading, conf.level, results[conf.attr]);
    }
  });
}

export function command(context, config, _callback) {
  // Get source of the attest module and rules config
  const attestSource = fs.readFileSync(path.resolve(process.cwd(), ATTEST_PATH), 'utf8');
  const attestConfig = require(path.resolve(process.cwd(), ATTEST_RULES_PATH));

  // Attach the attest source to the document
  this.execute(innerAttestSource => {
    const script = document.createElement('script');
    script.text = innerAttestSource;
    document.head.appendChild(script);
  }, [attestSource]);

  // Run attest checks and report
  this.executeAsync((innerContext, innerAttestConfig, done) => {
    /* eslint-disable no-undef */
    attest.configure(innerAttestConfig);
    attest.run(document, (err, results) => {
      done({ err, results });
    });
    /* eslint-enable no-undef */
  }, [context, attestConfig], asyncResult => {
    const scope = (config || {}).scope || '[n/a]';
    const { err, results } = asyncResult.value;

    if (results) {
      printResults(scope, this, results);
    } else if (err) {
      this.verify.fail(`${scope} attest run failure: ${JSON.stringify(err, null, 4)}`);
    }
  });
}
