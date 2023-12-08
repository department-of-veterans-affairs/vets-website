import { expect } from 'chai';

import {
  flagCurrentPageInTopLevelLinks,
  getAuthorizedLinkData,
  removeTrailingSlash,
} from '../containers/Main';

describe('mega-menu', () => {
  describe('Main.jsx', () => {
    describe('removeTrailingSlash', () => {
      it('should remove trailing slash from a URI', () => {
        expect(removeTrailingSlash('/test/')).to.eql('/test');
        expect(removeTrailingSlash('/test')).to.eql('/test');
        expect(removeTrailingSlash('/')).to.eql('/');
      });
    });
    describe('flagCurrentPageIntopLevelLinks', () => {
      it('should return object with currentPage: true when path name matches href', () => {
        // Test using pathName
        let links = [
          {
            href: '/test',
          },
          {
            href: '/test/',
          },
          {
            href: '/test/otherpage',
          },
          {
            href: 'not',
          },
          {
            href: 'not/',
          },
        ];
        let expectedResult = [
          {
            href: '/test',
            currentPage: true,
          },
          {
            href: '/test/',
            currentPage: true,
          },
          {
            href: '/test/otherpage',
          },
          {
            href: 'not',
          },
          {
            href: 'not/',
          },
        ];
        let actualResult = flagCurrentPageInTopLevelLinks(
          links,
          undefined,
          '/test',
        );
        expect(actualResult).to.eql(expectedResult);
        actualResult = flagCurrentPageInTopLevelLinks(
          links,
          undefined,
          '/test/',
        );
        expect(actualResult).to.eql(expectedResult);

        // Test using href
        links = [
          {
            href: '/test',
          },
          {
            href: '/test/',
          },
          {
            href: '/test/otherpage',
          },
        ];
        expectedResult = [
          {
            href: '/test',
            currentPage: true,
          },
          {
            href: '/test/',
            currentPage: true,
          },
          {
            href: '/test/otherpage',
          },
        ];
        actualResult = flagCurrentPageInTopLevelLinks(
          links,
          'http://example.com/test/somethingelse',
        );
        expect(actualResult).to.eql(expectedResult);
      });
    });
    describe('maybeMergeAuthorizedLinkData', () => {
      it('should merge Authorized links when loggedIn is true', () => {
        const AuthorizedLinks = ['test2', 'test3'];
        const defaultLinks = ['test0', 'test1'];
        const expectedResults = ['test0', 'test1', 'test2', 'test3'];

        const actualResults = getAuthorizedLinkData(
          true,
          defaultLinks,
          AuthorizedLinks,
        );

        expect(actualResults).to.eql(expectedResults);
      });
      it('should not merge Authorized links when loggedIn is false', () => {
        const AuthorizedLinks = ['test2', 'test3'];
        const defaultLinks = ['test0', 'test1'];
        const expectedResults = ['test0', 'test1'];

        const actualResults = getAuthorizedLinkData(
          false,
          defaultLinks,
          AuthorizedLinks,
        );

        expect(actualResults).to.eql(expectedResults);
      });
    });
  });
});
