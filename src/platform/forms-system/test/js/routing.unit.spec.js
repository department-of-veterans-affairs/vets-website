import { getNextPagePath, getPreviousPagePath } from '../../src/js/routing';

describe('Schemaform routing', () => {
  function getPageList(dependsCallback) {
    const pageList = [
      {
        pageKey: 'blah',
        path: 'a-path',
      },
      {
        pageKey: 'testPage',
        path: '/testing/:index',
        showPagePerItem: true,
        arrayPath: 'arrayProp',
      },
      {
        pageKey: 'testPage',
        path: '/testing/:index/conditional-page',
        showPagePerItem: true,
        arrayPath: 'arrayProp',
        depends: dependsCallback,
      },
      {
        pageKey: 'testPage',
        path: '/testing/last-page',
      },
    ];
    return pageList;
  }

  test("getNextPagePath should get next page when it's an array page", () => {
    const pageList = getPageList();
    const pathname = 'a-path';
    const data = {
      arrayProp: [{}],
    };

    const path = getNextPagePath(pageList, data, pathname);
    expect(path).toBe('/testing/0');
  });

  test('getPreviousPagePath should get previous page when on an array page', () => {
    const pageList = getPageList();
    const pathname = '/testing/0';
    const data = {
      arrayProp: [{}],
    };

    const path = getPreviousPagePath(pageList, data, pathname);
    expect(path).toBe('a-path');
  });

  test('getNextPagePath should skip an array page that depends on unfulfilled information in the array', () => {
    const pathname = '/testing/0';
    const data = {
      arrayProp: [{ condition: false }],
    };
    const pageList = getPageList(
      (formData, index) => formData.arrayProp[index].condition,
    );

    const path = getNextPagePath(pageList, data, pathname);
    expect(path).toBe('/testing/last-page');
  });

  test('getNextPagePath should not skip an array page that depends on fulfilled information in the array', () => {
    const pathname = '/testing/0';
    const data = {
      arrayProp: [{ condition: true }],
    };
    const pageList = getPageList(
      (formData, index) => formData.arrayProp[index].condition,
    );

    const path = getNextPagePath(pageList, data, pathname);
    expect(path).toBe('/testing/0/conditional-page');
  });

  test('getPreviousPagePath should skip an array page that depends on unfulfilled information in the array', () => {
    const pathname = '/testing/last-page';
    const data = {
      arrayProp: [{ condition: false }],
    };
    const pageList = getPageList(
      (formData, index) => formData.arrayProp[index].condition,
    );

    const path = getPreviousPagePath(pageList, data, pathname);
    expect(path).toBe('/testing/0');
  });

  test('getPreviousPagePath should not skip an array page that depends on fulfilled information in the array', () => {
    const pathname = '/testing/last-page';
    const data = {
      arrayProp: [{ condition: true }],
    };
    const pageList = getPageList(
      (formData, index) => formData.arrayProp[index].condition,
    );

    const path = getPreviousPagePath(pageList, data, pathname);
    expect(path).toBe('/testing/0/conditional-page');
  });

  test('getPreviousPagePath should go back to a previous dependent array page', () => {
    const pathname = '/testing/1';
    const data = {
      arrayProp: [{ condition: true }, { condition: false }],
    };
    const pageList = getPageList(
      (formData, index) => formData.arrayProp[index].condition,
    );

    const path = getPreviousPagePath(pageList, data, pathname);
    expect(path).toBe('/testing/0/conditional-page');
  });
});
