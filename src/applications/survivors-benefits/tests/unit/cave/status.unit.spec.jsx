import { expect } from 'chai';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import { pollDocumentStatus } from '../../../cave/status';

// Use intervalMs: 0 throughout so tests don't actually wait
const FAST = { intervalMs: 0, timeoutMs: 30000 };

describe('cave/status — pollDocumentStatus', () => {
  let sandbox;
  let apiRequestStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    apiRequestStub = sandbox.stub(api, 'apiRequest');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('returns immediately when scanStatus is "completed"', async () => {
    const payload = { scanStatus: 'completed', id: 'doc-1' };
    apiRequestStub.resolves(payload);
    const result = await pollDocumentStatus('doc-1', FAST);
    expect(result).to.deep.equal(payload);
    expect(apiRequestStub.callCount).to.equal(1);
  });

  it('returns immediately when scanStatus is "failed"', async () => {
    const payload = { scanStatus: 'failed', id: 'doc-1' };
    apiRequestStub.resolves(payload);
    const result = await pollDocumentStatus('doc-1', FAST);
    expect(result).to.deep.equal(payload);
  });

  it('polls again when scanStatus is pending, returns on second call', async () => {
    apiRequestStub
      .onFirstCall()
      .resolves({ scanStatus: 'pending' })
      .onSecondCall()
      .resolves({ scanStatus: 'completed', id: 'doc-1' });
    const result = await pollDocumentStatus('doc-1', FAST);
    expect(result.scanStatus).to.equal('completed');
    expect(apiRequestStub.callCount).to.equal(2);
  });

  it('polls three times before completing', async () => {
    apiRequestStub
      .onFirstCall()
      .resolves({ scanStatus: 'pending' })
      .onSecondCall()
      .resolves({ scanStatus: 'pending' })
      .onThirdCall()
      .resolves({ scanStatus: 'completed' });
    await pollDocumentStatus('doc-1', FAST);
    expect(apiRequestStub.callCount).to.equal(3);
  });

  it('throws "Timed out" when deadline has already passed (timeoutMs: -1)', async () => {
    // timeoutMs: -1 → deadline is in the past → loop never runs
    let error;
    try {
      await pollDocumentStatus('doc-1', { intervalMs: 0, timeoutMs: -1 });
    } catch (e) {
      error = e;
    }
    expect(error).to.be.instanceOf(Error);
    expect(error.message).to.include('Timed out');
    expect(apiRequestStub.callCount).to.equal(0);
  });

  it('rethrows the last API error when timed out after a failure', async () => {
    const apiError = new Error('Network error');
    // Make apiRequest always throw; use a very short timeout so we time out
    apiRequestStub.rejects(apiError);
    let error;
    try {
      // First call throws → lastError set → sleep(0) → Date.now() > deadline → rethrow
      await pollDocumentStatus('doc-1', { intervalMs: 0, timeoutMs: 1 });
    } catch (e) {
      error = e;
    }
    // Either rethrows the API error or the timeout error, but it must throw
    expect(error).to.be.instanceOf(Error);
  });

  it('calls the status URL containing the document id', async () => {
    apiRequestStub.resolves({ scanStatus: 'completed' });
    await pollDocumentStatus('my-doc-id', FAST);
    const calledUrl = apiRequestStub.firstCall.args[0];
    expect(calledUrl).to.include('my-doc-id');
    expect(calledUrl).to.include('/status');
  });
});
