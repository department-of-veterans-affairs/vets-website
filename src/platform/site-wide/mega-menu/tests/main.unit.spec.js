import {
  flagCurrentPageInTopLevelLinks,
  getAuthorizedLinkData,
} from '../containers/Main';

describe('mega-menu', () => {
  describe('Main.jsx', () => {
    describe('flagCurrentPageIntopLevelLinks', () => {
      test('should return object with currentPage: true when path name matches href', () => {
        const pathName = '/test';
        const links = [
          {
            href: '/test',
          },
          {
            href: 'not',
          },
        ];
        const expectedResult = [
          {
            href: '/test',
            currentPage: true,
          },
          {
            href: 'not',
          },
        ];
        const actualResult = flagCurrentPageInTopLevelLinks(links, pathName);

        expect(actualResult).toEqual(expectedResult);
      });
    });
    describe('maybeMergeAuthorizedLinkData', () => {
      test('should merge Authorized links when loggedIn is true', () => {
        const AuthorizedLinks = ['test2', 'test3'];
        const defaultLinks = ['test0', 'test1'];
        const expectedResults = ['test0', 'test1', 'test2', 'test3'];

        const actualResults = getAuthorizedLinkData(
          true,
          defaultLinks,
          AuthorizedLinks,
        );

        expect(actualResults).toEqual(expectedResults);
      });
      test('should not merge Authorized links when loggedIn is false', () => {
        const AuthorizedLinks = ['test2', 'test3'];
        const defaultLinks = ['test0', 'test1'];
        const expectedResults = ['test0', 'test1'];

        const actualResults = getAuthorizedLinkData(
          false,
          defaultLinks,
          AuthorizedLinks,
        );

        expect(actualResults).toEqual(expectedResults);
      });
    });
  });
});
