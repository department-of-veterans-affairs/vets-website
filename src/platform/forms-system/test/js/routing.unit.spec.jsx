import { expect } from 'chai';

import {
  getNextPagePath,
  getPreviousPagePath,
  checkValidPagePath,
  getRoute,
  createBreadcrumbListFromPath,
} from '../../src/js/routing';
import { createRoutes } from '../../src/js/routing/createRoutes';

describe('Schemaform routing', () => {
  function getPageList(dependsCallback) {
    return [
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
  }

  it("getNextPagePath should get next page when it's an array page", () => {
    const pageList = getPageList();
    const pathname = 'a-path';
    const data = {
      arrayProp: [{}],
    };

    const path = getNextPagePath(pageList, data, pathname);
    expect(path).to.equal('/testing/0');
  });

  it('getPreviousPagePath should get previous page when on an array page', () => {
    const pageList = getPageList();
    const pathname = '/testing/0';
    const data = {
      arrayProp: [{}],
    };

    const path = getPreviousPagePath(pageList, data, pathname);
    expect(path).to.equal('a-path');
  });

  it('getNextPagePath should skip an array page that depends on unfulfilled information in the array', () => {
    const pathname = '/testing/0';
    const data = {
      arrayProp: [{ condition: false }],
    };
    const pageList = getPageList(
      (formData, index) => formData.arrayProp[index].condition,
    );

    const path = getNextPagePath(pageList, data, pathname);
    expect(path).to.equal('/testing/last-page');
  });

  it('getNextPagePath should not skip an array page that depends on fulfilled information in the array', () => {
    const pathname = '/testing/0';
    const data = {
      arrayProp: [{ condition: true }],
    };
    const pageList = getPageList(
      (formData, index) => formData.arrayProp[index].condition,
    );

    const path = getNextPagePath(pageList, data, pathname);
    expect(path).to.equal('/testing/0/conditional-page');
  });

  it('getPreviousPagePath should skip an array page that depends on unfulfilled information in the array', () => {
    const pathname = '/testing/last-page';
    const data = {
      arrayProp: [{ condition: false }],
    };
    const pageList = getPageList(
      (formData, index) => formData.arrayProp[index].condition,
    );

    const path = getPreviousPagePath(pageList, data, pathname);
    expect(path).to.equal('/testing/0');
  });

  it('getPreviousPagePath should not skip an array page that depends on fulfilled information in the array', () => {
    const pathname = '/testing/last-page';
    const data = {
      arrayProp: [{ condition: true }],
    };
    const pageList = getPageList(
      (formData, index) => formData.arrayProp[index].condition,
    );

    const path = getPreviousPagePath(pageList, data, pathname);
    expect(path).to.equal('/testing/0/conditional-page');
  });

  it('getPreviousPagePath should go back to a previous dependent array page', () => {
    const pathname = '/testing/1';
    const data = {
      arrayProp: [{ condition: true }, { condition: false }],
    };
    const pageList = getPageList(
      (formData, index) => formData.arrayProp[index].condition,
    );

    const path = getPreviousPagePath(pageList, data, pathname);
    expect(path).to.equal('/testing/0/conditional-page');
  });

  describe('createRoutes', () => {
    it('should create routes', () => {
      const formConfig = {
        disableSave: true,
        chapters: {
          firstChapter: {
            pages: {
              testPage: {
                path: 'test-page',
              },
            },
          },
        },
      };

      const routes = createRoutes(formConfig);

      expect(routes[0].path).to.equal('test-page');
      expect(routes[1].path).to.equal('review-and-submit');
    });
    it('should create routes with intro', () => {
      const formConfig = {
        introduction: f => f,
        chapters: {
          firstChapter: {
            pages: {
              testPage: {
                path: 'test-page',
              },
            },
          },
        },
      };

      const routes = createRoutes(formConfig);

      expect(routes[0].path).to.equal('introduction');
    });
  });

  describe('checkValidPagePath', () => {
    it('should return true for plain paths', () => {
      const pageList = getPageList();
      const pathname = 'a-path'; // no leading `/` (on purpose?)
      const data = {
        arrayProp: [{}],
      };
      expect(checkValidPagePath(pageList, data, pathname)).to.be.true;
    });
    it('should return true for indexed paths', () => {
      const pageList = getPageList();
      const pathname = '/testing/0';
      const data = {
        arrayProp: [{}],
      };
      expect(checkValidPagePath(pageList, data, pathname)).to.be.true;
    });
    it('should return true for paths with a search parameter', () => {
      const pageList = getPageList();
      const pathname = '/testing/last-page?index=3';
      const data = {
        arrayProp: [{}],
      };
      expect(checkValidPagePath(pageList, data, pathname)).to.be.true;
    });
    it('should return false for undefined or empty paths', () => {
      const pageList = getPageList();
      const data = {
        arrayProp: [{}],
      };
      expect(checkValidPagePath(pageList, data)).to.be.false;
      expect(checkValidPagePath(pageList, data, '')).to.be.false;
    });
    it('should return false for paths that are conditionally not met', () => {
      const pathname = '/testing/0/conditional-page';
      const data = {
        arrayProp: [{ condition: false }],
      };
      const pageList = getPageList(
        (formData, index) => formData.arrayProp[index].condition,
      );

      expect(checkValidPagePath(pageList, data, pathname)).to.be.false;
    });
  });

  describe('other utilities', () => {
    it('getRoute', () => {
      const formConfig = {
        disableSave: true,
        chapters: {
          firstChapter: {
            pages: {
              testPage: {
                path: 'test-page',
              },
            },
          },
        },
      };

      const routes = createRoutes(formConfig);
      const location = {
        pathname: '/test-page',
      };

      expect(getRoute(routes, location).path).to.equal('test-page');
    });
  });
});

describe('createBreadcrumbListFromPath', () => {
  it('should parse a pathname and return a breadcrumb list', () => {
    let pathname = '/my-form/introduction';
    let breadcrumbList = createBreadcrumbListFromPath(pathname);
    expect(breadcrumbList).to.eql([
      { label: 'VA.gov home', href: '/' },
      { label: 'My form', href: '/my-form' },
    ]);

    pathname = '/';
    breadcrumbList = createBreadcrumbListFromPath(pathname);
    expect(breadcrumbList).to.eql([{ label: 'VA.gov home', href: '/' }]);

    pathname = null;
    breadcrumbList = createBreadcrumbListFromPath(pathname);
    expect(breadcrumbList).to.eql([{ label: 'VA.gov home', href: '/' }]);

    pathname = 'test-form/path-1/path-2';
    breadcrumbList = createBreadcrumbListFromPath(pathname);
    expect(breadcrumbList).to.eql([
      { label: 'VA.gov home', href: '/' },
      { label: 'Test form', href: '/test-form' },
      { label: 'Path 1', href: '/test-form/path-1' },
    ]);
  });
});
