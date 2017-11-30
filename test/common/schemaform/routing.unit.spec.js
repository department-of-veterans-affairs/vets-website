import { expect } from 'chai';

import { getNextPage, getPreviousPage } from '../../../src/js/common/schemaform/routing';

describe('Schemaform routing', () => {
  it('getNextPage should get next page when it\'s an array page', () => {
    const pageConfig = {
      pageKey: 'testPage',
      showPagePerItem: true,
      arrayPath: 'arrayProp',
      errorMessages: {},
      title: '',
      path: '/testing/:index'
    };

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

    const page = getNextPage(pageList, data, pathname, pageConfig);
    expect(page).to.equal('/testing/0');
  });

  it('getPreviousPage should get previous page when on an array page', () => {
    const pageConfig = {
      pageKey: 'testPage',
      showPagePerItem: true,
      arrayPath: 'arrayProp',
      errorMessages: {},
      title: '',
      path: '/testing/:index'
    };

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

    const page = getPreviousPage(pageList, data, pathname, pageConfig);
    expect(page).to.equal('a-path');
  });
});
