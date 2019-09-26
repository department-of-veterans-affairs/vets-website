/* eslint-disable no-console */

const { expect } = require('chai');
const sinon = require('sinon');

const checkBrokenLinks = require('../index');

const buildOptions = {};
const getBrokenLinks = sinon.stub();
const applyIgnoredRoutes = sinon.stub();
const getErrorOutput = sinon.stub();

const files = {
  'health-care.html': { path: 'health-care/' },
  'disability.html': { path: 'disability/' },
  'disability.pdf': { path: 'disability.pdf' },
};

const done = sinon.stub();

const middleware = checkBrokenLinks(
  buildOptions,
  getBrokenLinks,
  applyIgnoredRoutes,
  getErrorOutput,
);

function setBrokenLinksPerPage(brokenLinksPerPage) {
  getBrokenLinks.returns(new Array(brokenLinksPerPage));
}

function setTotalBrokenPages(totalBrokenPages) {
  applyIgnoredRoutes.returns(new Array(totalBrokenPages));
}

function setErrorOutput(errorOutput) {
  getErrorOutput.returns(errorOutput);
}

describe('build/check-broken-links', () => {
  before(() => {
    sinon.stub(console, 'log');
  });

  after(() => {
    console.log.restore();
  });

  beforeEach(() => {
    buildOptions['drupal-fail-fast'] = false;
    console.log.reset();
    getBrokenLinks.resetHistory();
    applyIgnoredRoutes.resetHistory();
    getErrorOutput.resetHistory();
    done.resetHistory();
  });

  it('evaluates only html pages', () => {
    setBrokenLinksPerPage(0);
    setTotalBrokenPages(0);
    middleware(files, null, done);
    expect(getBrokenLinks.callCount).to.be.equal(2);
    expect(getBrokenLinks.args[0][0]).to.be.deep.equal({
      path: 'health-care/',
    });
    expect(getBrokenLinks.args[1][0]).to.be.deep.equal({ path: 'disability/' });
  });

  it('calls applyIgnoredRoutes with all link-errors', () => {
    setBrokenLinksPerPage(5);
    setTotalBrokenPages(0);
    middleware(files, null, done);

    const brokenPages = applyIgnoredRoutes.firstCall.args[0];

    expect(brokenPages).to.be.deep.equal([
      {
        path: 'health-care/',
        linkErrors: new Array(5),
      },
      {
        path: 'disability/',
        linkErrors: new Array(5),
      },
    ]);
  });

  it('does not call getErrorOutput when there are no broken pages', () => {
    setBrokenLinksPerPage(0);
    setTotalBrokenPages(0);
    middleware(files, null, done);
    expect(getErrorOutput.called).to.be.false;
  });

  it('calls getErrorOutput when there are broken pages', () => {
    setBrokenLinksPerPage(0);
    setTotalBrokenPages(5);
    middleware(files, null, done);
    expect(getErrorOutput.called).to.be.true;
  });

  it('logs errors and calls done without arguments', () => {
    setBrokenLinksPerPage(0);
    setTotalBrokenPages(5);
    setErrorOutput('broken links!');

    middleware(files, null, done);
    expect(console.log.firstCall.args[0]).to.be.equal('broken links!');
    expect(done.firstCall.args[0]).to.be.undefined;
  });

  it('logs errors and calls done without arguments', () => {
    setBrokenLinksPerPage(0);
    setTotalBrokenPages(5);
    setErrorOutput('broken links!');

    buildOptions['drupal-fail-fast'] = true;

    middleware(files, null, done);
    expect(done.firstCall.args[0]).to.equal('broken links!');
  });
});
