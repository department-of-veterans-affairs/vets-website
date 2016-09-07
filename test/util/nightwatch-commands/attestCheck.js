import fs from 'fs';
import path from 'path';
import process from 'process';

const ATTEST_PATH = './test/util/attest-deps/node_modules/attest/attest.js';
const ATTEST_RULES_PATH = './test/util/attest-deps/node_modules/attest-rules/VA_508_ATtest.json';

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
    axe.configure(innerAttestConfig);
    axe.a11yCheck(document.querySelector(innerContext), { }, done);
    /* eslint-enable no-undef */
  }, [context, attestConfig], results => {
    const { violations, passes } = results.value;
    const scope = (config || {}).scope || '[n/a]';

    passes.forEach(pass => {
      this.assert.ok(true, `${scope}: ${pass.help}`);
    });

    violations.forEach(violation => {
      this.verify.fail(`${scope}: ${JSON.stringify(violation, null, 4)}`);
    });
  });
}
