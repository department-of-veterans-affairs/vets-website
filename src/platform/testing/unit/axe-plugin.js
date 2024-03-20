let axe;
async function loadAxe() {
  if (window.axe) {
    /* axe is already loaded */
    axe = window.axe;
    return;
  }

  if (typeof require === 'function') {
    /* axe is running in webpack */
    axe = require('axe-core/axe.min.js');
    return;
  }

  /**
   * Regular behavior, load axe as an ESModule & register it to the window
   */
  await import('axe-core/axe.min.js');
  if (!window.axe) {
    throw new Error(
      'Error importing axe-core/axe.min.js, are you using a bundler or build tool that doesnt handle es modules?',
    );
  }
  axe = window.axe;
}

const defaultRules = {
  region: { enabled: false },
  /**
   * Below are deprecated rules
   * Refernece: https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md#deprecated-rules
   */
  'duplicate-id': { enabled: false },
  'duplicate-id-active': { enabled: false },
  'audio-caption': { enabled: false },
  'aria-roledescription': { enabled: false },
};

/**
 * Creates a map of rules to disable during the test.
 * @param {Array<String>?} ignored List of rule names to ignore during the test.
 * @return {Object|undefined} List of rules to be passed to test configuration or
 * `undefined` when not needed.
 */
const getRules = ignored => {
  if (!ignored || !ignored.length) {
    return undefined;
  }
  const result = {};
  ignored.forEach(rule => {
    result[rule] = { enabled: false };
  });
  return result;
};

/**
 * Performs the test using AXE core.
 * @param {Element} element The element to be used to perform the test on.
 * @param {Object} opts AXE configuration options.
 * @return {Promise} Promise resolved to the test results object
 */
async function runTestAsync(element, opts) {
  if (!axe) {
    // ensure axe is loaded before running tests
    await loadAxe();
  }

  return new Promise((resolve, reject) => {
    axe.run(element, opts, (err, results) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(results);
      }
    });
  });
}

/**
 * Processes axe testing results.
 * @param {Boolean} negate When true "not" was used with the test and the output is the opposite
 * (failed test won't throw error)
 * @param {Object} results Axe test result object
 * @param {Function} done A function to be called when ready.
 * @throws {Error} When test did not pass.
 */
function processResults(negate, results, done) {
  const { violations } = results;

  if (violations?.length && negate) {
    done();
    return;
  }

  if (!violations?.length && !negate) {
    done();
    return;
  }

  const messages = [];
  if (violations?.length) {
    messages[messages.length] = '---';
    messages[messages.length] = 'Accessibility violations';
    violations.forEach(violation => {
      const nodeInfo = violation.nodes.reduce((str, node) => {
        const { html, target } = node;
        return [str, html, ...target].join('\n');
      }, '');
      messages[messages.length] = `Impact: [${violation.impact}] ${
        violation.help
      }
Reference: ${violation.helpUrl}
Context: ${nodeInfo}`;
      messages[messages.length] = '\n---';
    });
  }

  const msg = new Error(messages.join('\n'));
  done(msg);
  throw msg;
}

/**
 * @param {any} chai
 * @param {any} utils
 */
const chaiAxe = (chai, utils) => {
  const { assert } = chai;

  utils.addMethod(chai.Assertion.prototype, 'accessible', function axeTest(
    options,
  ) {
    const fixture = this._obj;
    const opts = options || {};

    const rules = getRules(opts.ignoredRules);

    const testOpts = {
      resultTypes: ['violations'],
      rules: {
        ...defaultRules,
        ...rules,
      },
      runOnly: {
        type: 'tag',
        values: [
          'section508',
          'wcag2a',
          'wcag2aa',
          'wcag21a',
          'wcag21aa',
          'best-practice',
        ],
      },
    };

    let done = opts.done ?? undefined;
    if (!done) {
      done = () => {};
    }

    if (opts.ignoredTags) {
      const ariaHiddenElements = fixture.parentNode.querySelectorAll(
        opts.ignoredTags.toString(),
      );
      ariaHiddenElements.forEach(el => el.setAttribute('aria-hidden', true));
    }

    const result = runTestAsync(fixture, testOpts).then(results =>
      processResults(utils.flag(this, 'negate'), results, done),
    );
    this.then = result.then.bind(result);
    return this;
  });

  assert.isAccessible = function isAccessible(fixture, options) {
    return new chai.Assertion(fixture).to.be.accessible(options);
  };

  assert.isNotAccessible = function isAccessible(fixture, options) {
    return new chai.Assertion(fixture).not.to.be.accessible(options);
  };
};

export default chaiAxe;
