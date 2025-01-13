import { expect } from 'chai';
import prefillTransformer from '../../../config/prefill-transformer';
import veteran from '../../e2e/fixtures/data/veteran.json';
import transformedFixture from '../../e2e/fixtures/data/transformed/prefill-transformer.json';

describe('prefillTransformer', () => {
  const pages = {};
  const metadata = {};
  const state = {
    user: {
      profile: {
        loa: { current: 3 },
        userFullName: {
          first: 'John',
          last: 'Veteran',
        },
      },
    },
  };

  it('should transform json correctly', () => {
    const formData = { veteran: veteran.data };

    const transformedResult = prefillTransformer(
      pages,
      formData,
      metadata,
      state,
    );
    expect(transformedResult).to.deep.equal(transformedFixture);
  });

  it('handles empty veteran', () => {
    const formData = {};

    const transformedResult = prefillTransformer(
      pages,
      formData,
      metadata,
      state,
    );
    expect(transformedResult).not.to.throw;
  });
});
