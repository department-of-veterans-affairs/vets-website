import { Pact } from '@pact-foundation/pact';

const contractTest = (consumer, provider, test) => {
  describe(consumer, () => {
    const mockApi = new Pact({
      port: 3000,
      consumer,
      provider,
      spec: 2,
    });

    before(() => mockApi.setup());
    after(() => mockApi.finalize());
    afterEach(() => mockApi.verify());

    test(mockApi);
  });
};

export default contractTest;
