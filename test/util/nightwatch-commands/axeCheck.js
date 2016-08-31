import axeCore from 'axe-core'; // eslint-disable-line no-unused-vars

export function command(context, config, _callback) {
  // Find the source of the axe module

  // TODO: since this is executed in the context of the browser,
  // we probably don't need to include this as an npm dependency,
  // we may be able to just download it locally into a test fixtures
  // directory and load the source.
  const axeSource = module.children.find((el) => {
    return (el.filename.indexOf('axe-core') !== -1);
  }).exports.source;

  // Attach the axe source to the document
  this.execute(innerAxeSource => {
    const script = document.createElement('script');
    script.text = innerAxeSource;
    document.head.appendChild(script);
  }, [axeSource]);

  // Run axe checks and report
  this.executeAsync((innerContext, done) => {
    axe.a11yCheck(document.querySelector(innerContext), { // eslint-disable-line no-undef
      runOnly: {
        type: 'tag',
        values: ['section508']
      }
    }, done);
  }, [context], results => {
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
