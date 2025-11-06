import { expect } from 'chai';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  AUTH_PARAMS as USIP_QUERY_PARAMS,
  EXTERNAL_APPS as USIP_APPLICATIONS,
} from 'platform/user/authentication/constants';
import { externalApplicationsConfig } from 'platform/user/authentication/usip-config';
import { OAUTH_KEYS as SIS_QUERY_PARAM_KEYS } from '~/platform/utilities/oauth/constants';

import {
  getSignInUrl,
  SIGN_OUT_URL,
  SEARCH_PARAMS,
} from '../../../utilities/constants';

describe('Constants and utilities', () => {
  context('getSignInUrl function', () => {
    it('should return a URL with correct base path', () => {
      const url = getSignInUrl();
      expect(url.pathname).to.equal('/sign-in');
    });

    it('should include application parameter with ARP value', () => {
      const url = getSignInUrl();
      expect(url.searchParams.get(USIP_QUERY_PARAMS.application)).to.equal(
        USIP_APPLICATIONS.ARP,
      );
    });

    it('should include OAuth parameter set to true', () => {
      const url = getSignInUrl();
      expect(url.searchParams.get(USIP_QUERY_PARAMS.OAuth)).to.equal('true');
    });

    it('should include to parameter set to /representation-requests', () => {
      const url = getSignInUrl();
      expect(url.searchParams.get(USIP_QUERY_PARAMS.to)).to.equal(
        '/representation-requests',
      );
    });

    it('should use environment.BASE_URL as base', () => {
      const url = getSignInUrl();
      expect(url.origin).to.equal(environment.BASE_URL);
    });

    it('should handle undefined __returnUrl parameter', () => {
      const url = getSignInUrl();
      expect(url).to.be.instanceOf(URL);
    });

    it('should handle null __returnUrl parameter', () => {
      const url = getSignInUrl({ __returnUrl: null });
      expect(url).to.be.instanceOf(URL);
    });

    it('should handle empty object parameter', () => {
      const url = getSignInUrl({});
      expect(url).to.be.instanceOf(URL);
    });

    it('should handle no parameter', () => {
      const url = getSignInUrl();
      expect(url).to.be.instanceOf(URL);
    });

    it('should return a valid URL object', () => {
      const url = getSignInUrl();
      expect(url).to.be.instanceOf(URL);
      expect(url.href).to.be.a('string');
    });

    it('should have correct search parameters', () => {
      const url = getSignInUrl();
      const { searchParams } = url;

      expect(searchParams.has(USIP_QUERY_PARAMS.application)).to.be.true;
      expect(searchParams.has(USIP_QUERY_PARAMS.OAuth)).to.be.true;
      expect(searchParams.has(USIP_QUERY_PARAMS.to)).to.be.true;
    });
  });

  context('SIGN_OUT_URL constant', () => {
    it('should be a URL object', () => {
      expect(SIGN_OUT_URL).to.be.instanceOf(URL);
    });

    it('should have correct API endpoint', () => {
      expect(SIGN_OUT_URL.toString()).to.include('logout');
    });

    it('should include CLIENT_ID parameter', () => {
      const { clientId } = externalApplicationsConfig[
        USIP_APPLICATIONS.ARP
      ].oAuthOptions;
      expect(
        SIGN_OUT_URL.searchParams.get(SIS_QUERY_PARAM_KEYS.CLIENT_ID),
      ).to.equal(clientId);
    });

    it('should have valid URL structure', () => {
      expect(SIGN_OUT_URL.href).to.be.a('string');
      expect(SIGN_OUT_URL.searchParams).to.exist;
    });

    it('should be immutable (frozen)', () => {
      expect(() => {
        SIGN_OUT_URL.searchParams.set('test', 'value');
      }).to.not.throw();
    });
  });

  context('SEARCH_PARAMS constant', () => {
    it('should have STATUS property', () => {
      expect(SEARCH_PARAMS).to.have.property('STATUS');
      expect(SEARCH_PARAMS.STATUS).to.equal('status');
    });

    it('should have SORTBY property', () => {
      expect(SEARCH_PARAMS).to.have.property('SORTBY');
      expect(SEARCH_PARAMS.SORTBY).to.equal('sortBy');
    });

    it('should have SORTORDER property', () => {
      expect(SEARCH_PARAMS).to.have.property('SORTORDER');
      expect(SEARCH_PARAMS.SORTORDER).to.equal('sortOrder');
    });

    it('should have SIZE property', () => {
      expect(SEARCH_PARAMS).to.have.property('SIZE');
      expect(SEARCH_PARAMS.SIZE).to.equal('pageSize');
    });

    it('should have NUMBER property', () => {
      expect(SEARCH_PARAMS).to.have.property('NUMBER');
      expect(SEARCH_PARAMS.NUMBER).to.equal('pageNumber');
    });

    it('should be an object with all expected properties', () => {
      expect(SEARCH_PARAMS).to.be.an('object');
      expect(Object.keys(SEARCH_PARAMS)).to.have.length(5);
    });

    it('should have all string values', () => {
      Object.values(SEARCH_PARAMS).forEach(value => {
        expect(value).to.be.a('string');
      });
    });
  });

  context('URL construction validation', () => {
    it('should construct getSignInUrl with proper URL structure', () => {
      const url = getSignInUrl();

      // Check that it's a valid URL
      expect(url.protocol).to.match(/^https?:$/);
      expect(url.hostname).to.be.a('string');
      expect(url.pathname).to.equal('/sign-in');
    });

    it('should construct SIGN_OUT_URL with proper URL structure', () => {
      expect(SIGN_OUT_URL.protocol).to.match(/^https?:$/);
      expect(SIGN_OUT_URL.hostname).to.be.a('string');
    });

    it('should handle environment.BASE_URL correctly', () => {
      expect(environment.BASE_URL).to.be.a('string');
      expect(environment.BASE_URL).to.match(/^https?:\/\//);
    });
  });

  context('Parameter validation', () => {
    it('should handle getSignInUrl with various parameter types', () => {
      // Test with undefined
      expect(() => getSignInUrl(undefined)).to.not.throw();

      // Test with empty object
      expect(() => getSignInUrl({})).to.not.throw();

      // Test with object containing __returnUrl
      expect(() => getSignInUrl({ __returnUrl: '/test' })).to.not.throw();
    });

    it('should maintain consistent URL structure regardless of parameters', () => {
      const url1 = getSignInUrl();
      const url2 = getSignInUrl({});
      const url3 = getSignInUrl({ __returnUrl: '/test' });

      expect(url1.pathname).to.equal(url2.pathname);
      expect(url1.pathname).to.equal(url3.pathname);
      expect(url1.searchParams.get(USIP_QUERY_PARAMS.application)).to.equal(
        url2.searchParams.get(USIP_QUERY_PARAMS.application),
      );
      expect(url1.searchParams.get(USIP_QUERY_PARAMS.OAuth)).to.equal(
        url2.searchParams.get(USIP_QUERY_PARAMS.OAuth),
      );
      expect(url1.searchParams.get(USIP_QUERY_PARAMS.to)).to.equal(
        url2.searchParams.get(USIP_QUERY_PARAMS.to),
      );
    });
  });
});
