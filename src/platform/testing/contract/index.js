import { Pact } from '@pact-foundation/pact';

/**
 * Helper for writing a Pact contract test that abstracts the boilerplate
 * for setting up the mock API and using it to verify the mocked interactions.
 *
 * @param {string} consumer - String label for the consumer.
 * @param {string} provider - String label for the provider.
 * @param {function} test - Callback function for a test suite (describe block).
 */
const contractTest = (consumer, provider, test) => {
  describe(consumer, () => {
    const mockApi = new Pact({
      port: 3000,
      consumer,
      provider,
      spec: 2,
      cors: true,
    });

    before(() => mockApi.setup());
    after(() => mockApi.finalize());
    afterEach(() => mockApi.verify());

    test(mockApi);
  });
};

export default contractTest;
