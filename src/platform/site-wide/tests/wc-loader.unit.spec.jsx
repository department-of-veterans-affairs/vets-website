import { expect } from 'chai';
import sinon from 'sinon';
import { isChunkLoadError } from '../../utilities/lazy-load-with-retry';

describe('wc-loader', () => {
  let applyPolyfillsStub;
  let defineCustomElementsStub;
  let consoleWarnStub;

  beforeEach(() => {
    applyPolyfillsStub = sinon.stub().resolves();
    defineCustomElementsStub = sinon.stub().resolves();
    consoleWarnStub = sinon.stub(console, 'warn');
  });

  afterEach(() => {
    consoleWarnStub.restore();
  });

  describe('initWithRetry logic', () => {
    const MAX_RETRIES = 3;
    const BASE_DELAY_MS = 10; // Short delay for tests

    async function initWithRetry(
      applyPolyfillsFn,
      defineCustomElementsFn,
      attempt = 1,
    ) {
      try {
        await applyPolyfillsFn();
        await defineCustomElementsFn();
      } catch (error) {
        if (attempt <= MAX_RETRIES && isChunkLoadError(error)) {
          const delay = BASE_DELAY_MS * attempt;
          // eslint-disable-next-line no-console
          console.warn(
            `[wc-loader] Retry ${attempt}/${MAX_RETRIES} after ChunkLoadError`,
          );
          await new Promise(resolve => setTimeout(resolve, delay));
          await initWithRetry(
            applyPolyfillsFn,
            defineCustomElementsFn,
            attempt + 1,
          );
          return;
        }
        throw error;
      }
    }

    it('initializes successfully on first attempt', async () => {
      await initWithRetry(applyPolyfillsStub, defineCustomElementsStub);

      expect(applyPolyfillsStub.calledOnce).to.be.true;
      expect(defineCustomElementsStub.calledOnce).to.be.true;
      expect(consoleWarnStub.called).to.be.false;
    });

    it('retries and succeeds after transient ChunkLoadError from defineCustomElements', async () => {
      const chunkError = new Error(
        'Loading chunk component-library-abc123 failed.',
      );
      chunkError.name = 'ChunkLoadError';

      defineCustomElementsStub
        .onFirstCall()
        .rejects(chunkError)
        .onSecondCall()
        .resolves();

      await initWithRetry(applyPolyfillsStub, defineCustomElementsStub);

      expect(applyPolyfillsStub.calledTwice).to.be.true;
      expect(defineCustomElementsStub.calledTwice).to.be.true;
      expect(consoleWarnStub.calledOnce).to.be.true;
      expect(consoleWarnStub.firstCall.args[0]).to.include(
        '[wc-loader] Retry 1/3',
      );
    });

    it('retries and succeeds after transient ChunkLoadError from applyPolyfills', async () => {
      const chunkError = new Error('Loading chunk polyfills-abc123 failed.');
      chunkError.name = 'ChunkLoadError';

      applyPolyfillsStub
        .onFirstCall()
        .rejects(chunkError)
        .onSecondCall()
        .resolves();

      await initWithRetry(applyPolyfillsStub, defineCustomElementsStub);

      expect(applyPolyfillsStub.calledTwice).to.be.true;
      // defineCustomElements not called on first attempt since applyPolyfills failed
      expect(defineCustomElementsStub.calledOnce).to.be.true;
      expect(consoleWarnStub.calledOnce).to.be.true;
    });

    it('gives up after max retries and throws', async () => {
      const chunkError = new Error(
        'Loading chunk component-library-abc123 failed.',
      );
      chunkError.name = 'ChunkLoadError';

      defineCustomElementsStub.rejects(chunkError);

      try {
        await initWithRetry(applyPolyfillsStub, defineCustomElementsStub);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error.name).to.equal('ChunkLoadError');
      }

      // 1 initial + 3 retries = 4 total attempts
      expect(defineCustomElementsStub.callCount).to.equal(4);
      expect(consoleWarnStub.callCount).to.equal(3);
    });

    it('does not retry on non-ChunkLoadError errors', async () => {
      const otherError = new TypeError('Cannot read properties of undefined');

      defineCustomElementsStub.rejects(otherError);

      try {
        await initWithRetry(applyPolyfillsStub, defineCustomElementsStub);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error.message).to.equal('Cannot read properties of undefined');
      }

      expect(defineCustomElementsStub.calledOnce).to.be.true;
      expect(consoleWarnStub.called).to.be.false;
    });

    it('succeeds on third attempt after two failures', async () => {
      const chunkError = new Error(
        'Loading chunk component-library-abc123 failed.',
      );
      chunkError.name = 'ChunkLoadError';

      defineCustomElementsStub
        .onFirstCall()
        .rejects(chunkError)
        .onSecondCall()
        .rejects(chunkError)
        .onThirdCall()
        .resolves();

      await initWithRetry(applyPolyfillsStub, defineCustomElementsStub);

      expect(defineCustomElementsStub.calledThrice).to.be.true;
      expect(consoleWarnStub.calledTwice).to.be.true;
      expect(consoleWarnStub.firstCall.args[0]).to.include('Retry 1/3');
      expect(consoleWarnStub.secondCall.args[0]).to.include('Retry 2/3');
    });
  });
});
