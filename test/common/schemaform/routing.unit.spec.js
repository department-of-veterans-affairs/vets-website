import { expect } from 'chai';

import { getNextPagePath, getPreviousPagePath } from '../../../src/js/common/schemaform/routing';

describe('Schemaform routing', () => {
  it('getNextPagePath should get next page when it\'s an array page', () => {
    const pageList = [
      {
        pageKey: 'blah',
        path: 'a-path'
      },
      {
        pageKey: 'testPage',
        path: '/testing/:index',
        showPagePerItem: true,
        arrayPath: 'arrayProp'
      }
    ];
    const data = {
      arrayProp: [{}]
    };
    const pathname = 'a-path';

    const path = getNextPagePath(pageList, data, pathname);
    expect(path).to.equal('/testing/0');
  });

  it('getPreviousPagePath should get previous page when on an array page', () => {
    const pageList = [
      {
        pageKey: 'blah',
        path: 'a-path'
      },
      {
        pageKey: 'testPage',
        path: '/testing/:index',
        showPagePerItem: true,
        arrayPath: 'arrayProp'
      }
    ];
    const data = {
      arrayProp: [{}]
    };
    const pathname = '/testing/0';

    const path = getPreviousPagePath(pageList, data, pathname);
    expect(path).to.equal('a-path');
  });
});
