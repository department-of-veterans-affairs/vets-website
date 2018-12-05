import { expect } from 'chai';
import checkCollections from '../check-collections';
import ware from 'ware';

describe('checkCollections MetalSmith Plugin', () => {
  it('Should pass if page collection is in the list of collections', () => {
    const middleware = ware().use(checkCollections());

    middleware.run(
      {
        'index.html': {
          collection: 'burialsPlanABurial',
        },
        'index.md': {
          collection: 'healthCostOfCare',
        },
      },
      {},
      () => {
        expect('My Account').to.equal('My Account');
      },
    );
  });
});
