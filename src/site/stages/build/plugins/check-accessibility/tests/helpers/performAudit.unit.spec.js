const { expect } = require('chai');
const sinon = require('sinon');

const performAudit = require('../../helpers/performAudit');

const { auditNextHtmlFile } = performAudit;

const stubWorker = {
  on(eventName, handleEvent) {
    this.onMessage = sinon.spy(handleEvent);
  },
};

describe('performAudit', () => {
  it('creates workers and returns a promise that resolves with a result object', async () => {
    const buildOptions = {};
    const htmlFiles = [1, 2, 3];
    const _auditNextHtmlFile = sinon.stub();
    const getWorker = sinon.spy(() => ({ ...stubWorker }));
    const getErrorOutput = sinon.stub();

    const audit = performAudit(
      buildOptions,
      htmlFiles,
      _auditNextHtmlFile,
      getErrorOutput,
      getWorker,
    );

    expect(getWorker.callCount).to.be.greaterThan(
      2,
      'There are at least two workers',
    );
    expect(getWorker.callCount).to.be.equal(
      _auditNextHtmlFile.callCount,
      'It calls the audit helper for each worker',
    );
    expect(audit).to.be.instanceOf(Promise, 'It returns a promise');

    const resolveArgIndex = 4;
    const resolve = _auditNextHtmlFile.args[0][resolveArgIndex];

    expect(resolve).to.be.instanceOf(
      Function,
      '"resolve" is a function for resolving the returned promise',
    );

    setTimeout(() => {
      resolve();
    }, 1);

    const worker = getWorker.firstCall.returnValue;

    const badResult = { url: 'https://bad', violations: [1] };
    worker.onMessage({ error: null, result: badResult });
    expect(getErrorOutput.called).to.be.true;

    const incompleteResult = { url: 'https://incomplete', incomplete: [1] };
    worker.onMessage({ error: null, result: incompleteResult });

    const successfulResult = { url: 'https://good' };
    worker.onMessage({ error: null, result: successfulResult });

    const results = await audit;

    expect(results).to.be.deep.equal(
      {
        failures: [badResult],
        incompletes: [incompleteResult],
        filesScanned: worker.onMessage.callCount,
        totalFiles: htmlFiles.length,
      },
      'The results object contains correct values',
    );
  });
});

describe('auditNextHtmlFile', () => {
  it('passes the next html file to the worker', () => {
    const buildOptions = { hostUrl: 'https://www.va.gov' };
    const htmlFiles = ['file1', 'file2'];
    const worker = {
      send: sinon.spy(),
    };
    const workerPool = [worker, {}];
    const done = sinon.stub();

    auditNextHtmlFile(buildOptions, htmlFiles, workerPool, worker, done);

    expect(htmlFiles).to.be.deep.equal(['file2']);
    expect(workerPool).to.be.deep.equal([worker, {}]);
    expect(worker.send.called).to.be.true;
    expect(done.called).to.be.false;
  });

  it('kills the worker and removes it from the pool when there are no files left to process', () => {
    const buildOptions = {};
    const htmlFiles = [];
    const worker = {
      kill: sinon.spy(),
    };
    const workerPool = [worker, {}];
    const done = sinon.stub();

    auditNextHtmlFile(buildOptions, htmlFiles, workerPool, worker, done);

    expect(workerPool).to.be.deep.equal(
      [{}],
      'The worker was removed from the pool',
    );
    expect(worker.kill.called).to.be.true;
    expect(done.called).to.be.false;
  });

  it('calls done when there are all workers are finished', () => {
    const buildOptions = {};
    const htmlFiles = [];
    const worker = {
      kill: sinon.spy(),
    };
    const workerPool = [worker];
    const done = sinon.stub();

    auditNextHtmlFile(buildOptions, htmlFiles, workerPool, worker, done);

    expect(workerPool).to.be.deep.equal(
      [],
      'The worker was removed from the pool',
    );
    expect(worker.kill.called).to.be.true;
    expect(done.called).to.be.true;
  });
});
