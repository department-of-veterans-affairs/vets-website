import { expect } from 'chai';
import sinon from 'sinon';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import * as vapSvcUtils from '~/platform/user/profile/vap-svc/util/local-vapsvc';
import {
  makeUserObject,
  formatFullName,
  normalizePath,
  getRouteInfoFromPath,
  isClientError,
  isServerError,
} from '../helpers';

describe('personalization common helpers', () => {
  describe('makeUserObject', () => {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      sandbox
        .stub(vapSvcUtils, 'makeMockContactInfo')
        .returns({ email: 'mock@example.com' });
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('returns defaults when no options are provided', () => {
      const result = makeUserObject();

      expect(result.data.attributes.services).to.deep.equal(['vet360']);
      expect(result.data.attributes.profile.loa.current).to.equal(3);
      expect(result.data.attributes.profile.multifactor).to.equal(true);
      expect(result.data.attributes.profile.signIn.serviceName).to.equal(
        CSP_IDS.ID_ME,
      );
      expect(result.data.attributes.profile.claims).to.have.property(
        'personal_information',
        true,
      );
      expect(result.data.attributes.vet360ContactInformation).to.deep.equal({
        email: 'mock@example.com',
      });
      expect(vapSvcUtils.makeMockContactInfo.calledOnce).to.equal(true);
    });

    it('adds services and overrides claims when options are provided', () => {
      const claimsOverride = { custom: true };
      const result = makeUserObject({
        rx: true,
        messaging: true,
        claims: claimsOverride,
      });

      expect(result.data.attributes.services).to.deep.equal([
        'vet360',
        'rx',
        'messaging',
      ]);
      expect(result.data.attributes.profile.claims).to.equal(claimsOverride);
    });

    it('uses patient facilities when provided for a patient', () => {
      const facilities = [{ facilityId: '123', isCerner: true }];
      const result = makeUserObject({
        isPatient: true,
        facilities,
        isCerner: true,
        mhvAccountState: 'REGISTERED',
      });

      expect(result.data.attributes.vaProfile.facilities).to.equal(facilities);
      expect(result.data.attributes.vaProfile.isCernerPatient).to.equal(true);
      expect(result.data.attributes.vaProfile.vaPatient).to.equal(true);
      expect(result.data.attributes.vaProfile.mhvAccountState).to.equal(
        'REGISTERED',
      );
    });

    it('sets facilities to null for non-patients and uses contact info override', () => {
      const contactInformation = { email: 'override@example.com' };
      const result = makeUserObject({
        isPatient: false,
        facilities: [{ facilityId: 'ignored' }],
        contactInformation,
        inProgressForms: ['FORM_123'],
        serviceName: CSP_IDS.LOGIN_GOV,
        loa: 2,
        multifactor: false,
      });

      expect(result.data.attributes.vaProfile.facilities).to.equal(null);
      expect(result.data.attributes.vet360ContactInformation).to.equal(
        contactInformation,
      );
      expect(result.data.attributes.inProgressForms).to.deep.equal([
        'FORM_123',
      ]);
      expect(result.data.attributes.profile.signIn.serviceName).to.equal(
        CSP_IDS.LOGIN_GOV,
      );
      expect(result.data.attributes.profile.loa.current).to.equal(2);
      expect(result.data.attributes.profile.multifactor).to.equal(false);
      expect(vapSvcUtils.makeMockContactInfo.called).to.equal(false);
    });
  });

  describe('formatFullName', () => {
    it('formats names with middle initials capitalized', () => {
      const result = formatFullName({
        first: 'Ada',
        middle: 'a b',
        last: 'Lovelace',
        suffix: 'Jr.',
      });

      expect(result).to.equal('Ada A B Lovelace Jr.');
    });

    it('handles missing first names', () => {
      const result = formatFullName({
        middle: 'm',
        last: 'Gogh',
      });

      expect(result).to.equal('M Gogh');
    });

    it('handles missing last names', () => {
      const result = formatFullName({
        first: 'Prince',
        middle: '',
        suffix: 'III',
      });

      expect(result).to.equal('Prince III');
    });

    it('omits missing parts without extra spaces', () => {
      const result = formatFullName({ first: 'Cher', last: '' });

      expect(result).to.equal('Cher');
    });
  });

  describe('normalizePath', () => {
    it('removes a trailing slash based on trimmed input', () => {
      const result = normalizePath('  /profile/  ');

      expect(result).to.equal('  /profile/ ');
    });

    it('returns the original path when no trailing slash exists', () => {
      const result = normalizePath(' /profile');

      expect(result).to.equal(' /profile');
    });
  });

  describe('getRouteInfoFromPath', () => {
    it('returns a matched route for normalized paths', () => {
      const routes = [
        { path: '/profile', label: 'Profile' },
        { path: '/settings', label: 'Settings' },
      ];

      const result = getRouteInfoFromPath('/profile/', routes);

      expect(result).to.equal(routes[0]);
    });

    it('throws when no route matches', () => {
      const routes = [{ path: '/profile', label: 'Profile' }];

      expect(() => getRouteInfoFromPath('/unknown', routes)).to.throw(
        'No route found for path',
      );
    });
  });

  describe('error helpers', () => {
    it('identifies client errors', () => {
      expect(isClientError('404')).to.equal(true);
      expect(isClientError(400)).to.equal(true);
      expect(isClientError('500')).to.equal(false);
    });

    it('identifies server errors', () => {
      expect(isServerError('500')).to.equal(true);
      expect(isServerError(503)).to.equal(true);
      expect(isServerError('200')).to.equal(false);
    });
  });
});
