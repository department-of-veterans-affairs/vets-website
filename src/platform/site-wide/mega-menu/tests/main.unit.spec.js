import { expect } from 'chai';

import {
  flagCurrentPageInTopLevelLinks,
  maybeMergeAuthenticatedLinkData
} from '../containers/Main';

describe('mega-menu', () => {
  describe('Main.jsx', () => {
    describe('flagCurrentPageIntopLevelLinks', () => {
      it('should return object with currentPage: true when path name matches href', () => {
        const pathName = '/test';
        const links = [{
          href: '/test'
        }, {
          href: 'not'
        }
        ];
        const expectedResult = [{
          href: '/test',
          currentPage: true
        }, {
          href: 'not'
        }
        ];
        const actualResult = flagCurrentPageInTopLevelLinks(links, pathName);

        expect(actualResult).to.eql(expectedResult);
      });
    });
    describe('maybeMergeAuthenticatedLinkData', () => {
      it('should merge authenticated links when loggedIn is true', () => {
        const authenticatedLinks = ['test2', 'test3'];
        const defaultLinks = ['test0', 'test1'];
        const expectedResults = ['test0', 'test1', 'test2', 'test3'];

        const actualResults = maybeMergeAuthenticatedLinkData(true, authenticatedLinks, defaultLinks);

        expect(actualResults).to.eql(expectedResults);
      });
      it('should not merge authenticated links when loggedIn is false', () => {
        const authenticatedLinks = ['test2', 'test3'];
        const defaultLinks = ['test0', 'test1'];
        const expectedResults = ['test0', 'test1'];

        const actualResults = maybeMergeAuthenticatedLinkData(false, authenticatedLinks, defaultLinks);

        expect(actualResults).to.eql(expectedResults);
      });
    });
  });
});
