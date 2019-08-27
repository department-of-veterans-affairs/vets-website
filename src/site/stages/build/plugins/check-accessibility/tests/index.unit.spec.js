const { expect } = require('chai');
const sinon = require('sinon');

const ENVIRONMENTS = require('../../../../../constants/environments');

const checkAccessibility = require('../index');

const { getAuditSummary } = checkAccessibility;
const done = sinon.stub();

describe('build/check-accessibility', () => {
  beforeEach(() => {
    done.reset();
  });

  it('returns a noop when the accessibility flag is missing', () => {
    const buildOptions = {};
    const plugin = checkAccessibility(buildOptions);

    expect(plugin()).to.be.undefined;
  });

  it('executes the callback with nothing when results are okay', async () => {
    const buildOptions = {
      accessibility: true,
      buildtype: ENVIRONMENTS.VAGOVPROD,
    };
    const getHtmlFileList = sinon.stub().returns([]);
    const auditResults = {
      failures: [],
      incompletes: [],
    };

    const performAudit = sinon.stub().returns(Promise.resolve(auditResults));
    const plugin = checkAccessibility(
      buildOptions,
      getHtmlFileList,
      performAudit,
    );

    await plugin([], null, done);

    expect(done.called).to.be.true;
    expect(done.callCount).to.be.equal(1);
    expect(done.firstCall.args).to.be.deep.equal(
      [],
      'The callback should be called with no args to indicate success',
    );
  });

  it('executes the callback with an argument when the results are bad', async () => {
    const buildOptions = {
      accessibility: true,
      buildtype: ENVIRONMENTS.VAGOVPROD,
    };
    const getHtmlFileList = sinon.stub().returns([]);
    const auditResults = {
      failures: [1, 2, 3],
      incompletes: [],
    };

    const performAudit = sinon.stub().returns(Promise.resolve(auditResults));
    const _getAuditSummary = sinon.stub().returns('Anything truthy');
    const plugin = checkAccessibility(
      buildOptions,
      getHtmlFileList,
      performAudit,
      _getAuditSummary,
    );

    await plugin([], null, done);

    expect(done.called).to.be.true;
    expect(done.callCount).to.be.equal(1);
    expect(done.firstCall.args[0]).to.be.ok;
  });

  it('formats the audit results into a summary', () => {
    const auditResults = {
      filesScanned: 5,
      totalFiles: 5,
      failures: [
        { url: 'https://example.va.gov/test1' },
        { url: 'https://example.va.gov/test2' },
      ],
      incompletes: [],
    };

    const result = getAuditSummary(auditResults);
    expect(result).to.contain('Scanned 5 of 5 files');
    expect(result).to.contain('https://example.va.gov/test1');
    expect(result).to.not.contain('Incomplete pages:');
  });
});
