import { expect } from 'chai';

import {
  flagCurrentPageInTopLevelLinks,
  getAuthorizedLinkData,
  mapStateToProps,
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

    describe('mapStateToProps — profile-loading gate', () => {
      const loggedInLoading = {
        user: {
          login: { currentlyLoggedIn: true },
          profile: { loading: true },
        },
        featureToggles: {},
        megaMenu: {},
      };

      const loggedInReady = {
        user: {
          login: { currentlyLoggedIn: true },
          profile: { loading: false },
        },
        featureToggles: {},
        megaMenu: {},
      };

      const loggedOutReady = {
        user: {
          login: { currentlyLoggedIn: false },
          profile: { loading: false },
        },
        featureToggles: {},
        megaMenu: {},
      };

      it('excludes My VA and My HealtheVet from menu data while profile is loading', () => {
        const { data } = mapStateToProps(loggedInLoading, {});
        expect(data.find(l => l.href === MY_VA_LINK.href)).to.be.undefined;
        expect(data.find(l => l.href === MY_HEALTH_LINK.href)).to.be.undefined;
      });

      it('includes My VA and My HealtheVet once profile has loaded', () => {
        const { data } = mapStateToProps(loggedInReady, {});
        expect(data.find(l => l.href === MY_VA_LINK.href)).to.exist;
        expect(data.find(l => l.href === MY_HEALTH_LINK.href)).to.exist;
      });

      it('excludes links when logged out even if profile is not loading', () => {
        const { data } = mapStateToProps(loggedOutReady, {});
        expect(data.find(l => l.href === MY_VA_LINK.href)).to.be.undefined;
        expect(data.find(l => l.href === MY_HEALTH_LINK.href)).to.be.undefined;
      });

      it('excludes links when featureToggleMhvHeaderLinks is true and profile is loading', () => {
        const state = {
          ...loggedInLoading,
          featureToggles: { mhvHeaderLinks: true },
        };
        const { data } = mapStateToProps(state, {});
        expect(data.find(l => l.href === MY_VA_LINK.href)).to.be.undefined;
        expect(data.find(l => l.href === MY_HEALTH_LINK.href)).to.be.undefined;
      });

      it('includes links when featureToggleMhvHeaderLinks is true and profile is ready', () => {
        const state = {
          ...loggedInReady,
          featureToggles: { mhvHeaderLinks: true },
        };
        const { data } = mapStateToProps(state, {});
        expect(data.find(l => l.href === MY_VA_LINK.href)).to.exist;
        expect(data.find(l => l.href === MY_HEALTH_LINK.href)).to.exist;
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
