import { expect } from 'chai';

import reducers from '../../reducers';

describe('Find VA Forms reducer: index', () => {
  it('returns the default state', () => {
    const result = reducers.findVaForms(undefined, {});

    expect(result).to.be.deep.equal({
      query: '',
      searchResults: null,
    });
  });
});
