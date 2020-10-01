import { Pact } from '@pact-foundation/pact';

/**
 * Helper for writing a Pact contract test that abstracts the boilerplate
 * for setting up the mock API and using it to verify the mocked interactions.
 *
 * @param {string} consumer - String label for the consumer.
 * @param {string} provider - String label for the provider.
 * @param {function} test - Callback function for a test suite (describe block).
 *                          Receives one argument: a function that returns the
 *                          mock provider instance for the test.
 */
const contractTest = (consumer, provider, test) => {
  describe(consumer, () => {
    // The mock server is initialized in the before hook so that
    // separate contract tests don't conflict by attempting to
    // create mock servers at the same port.
    let mockApi;

    // This wrapper function is used as a closure around mockApi
    // to indirectly pass the mock server to the test callback
    // since it's not initialized until the before hook runs.
    const mockApiWrapper = () => mockApi;

    before('set up mock server', () => {
      mockApi = new Pact({
        port: 3000,
        consumer,
        provider,
        spec: 2,
        cors: true,
      });

      return mockApi.setup();
    });

    after('generate pacts', () => mockApi.finalize());

    afterEach('verify interactions', () => mockApi.verify());

    test(mockApiWrapper);
  });
};

export default contractTest;
