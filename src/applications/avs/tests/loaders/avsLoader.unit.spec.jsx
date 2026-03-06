import { expect } from 'chai';

import { server } from 'platform/testing/unit/mocha-setup';

import { avsLoader } from '../../loaders/avsLoader';
import { avsHandlers, handlers, mockAvs } from '../../mocks/server';

describe('avsLoader', () => {
  beforeEach(() => {
    server.use(...avsHandlers);
  });

  afterEach(() => server.resetHandlers());

  it('should return deferred data on successful API request', async () => {
    const params = { id: mockAvs.data.id };

    const result = await avsLoader({ params });

    // defer returns an object with a data property containing promises
    const avs = await result.data.avs;
    expect(avs.id).to.equal(mockAvs.data.id);
  });

  it('should return 404 for unknown AVS id', async () => {
    const params = { id: 'unknown-id' };

    const result = await avsLoader({ params });

    // The loader defers the error, so we need to await and catch
    try {
      await result.data.avs;
      expect.fail('Should have thrown an error');
    } catch (e) {
      expect(e.errors[0].status).to.equal('not_found');
    }
  });

  it('should handle server errors', async () => {
    server.use(handlers.avsServerError());
    const params = { id: mockAvs.data.id };

    const result = await avsLoader({ params });

    try {
      await result.data.avs;
      expect.fail('Should have thrown an error');
    } catch (e) {
      expect(e.errors[0].title).to.equal('Internal Server Error');
    }
  });
});
