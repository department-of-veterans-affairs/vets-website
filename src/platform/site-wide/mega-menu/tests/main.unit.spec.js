import { expect } from 'chai';

import {
  flagCurrentPageInTopLevelLinks,
  getAuthorizedLinkData,
} from '../containers/Main';

import MY_HEALTH_LINK from '../constants/MY_HEALTH_LINK';
import MY_VA_LINK from '../constants/MY_VA_LINK';

describe('mega-menu', () => {
  describe('Main.jsx', () => {
    const links = [MY_VA_LINK, MY_HEALTH_LINK];

    describe('link constants', () => {
      links.forEach(({ href }) => {
        it(`${href} must end with a forward-slash`, () => {
          expect(href.endsWith('/')).to.be.true;
        });
      });
    });

    describe('flagCurrentPageInTopLevelLinks', () => {
      ['/my-va', '/my-va/', '/my-va/abc', '/my-va/abc/'].forEach(path => {
        it(`sets currentPage on the myVA link object for ${path} path`, () => {
          const [myVa, myHealth] = flagCurrentPageInTopLevelLinks(links, path);
          expect(myVa.currentPage).to.be.true;
          expect(myHealth.currentPage).to.be.undefined;
        });
      });

      [
        '/my-health',
        '/my-health/',
        '/my-health/messages',
        '/my-health/messages/',
      ].forEach(path => {
        it(`sets currentPage on the myHealth link object for ${path} path`, () => {
          const [myVa, myHealth] = flagCurrentPageInTopLevelLinks(links, path);
          expect(myVa.currentPage).to.be.undefined;
          expect(myHealth.currentPage).to.be.true;
        });
      });

      ['/', '/no', '', 'asdf', '/my-healthcare', '/my-va-benefits'].forEach(
        path => {
          it(`does not set currentPage for ${path} path`, () => {
            const [myVa, myHealth] = flagCurrentPageInTopLevelLinks(
              links,
              path,
            );
            expect(myVa.currentPage).to.be.undefined;
            expect(myHealth.currentPage).to.be.undefined;
          });
        },
      );
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
