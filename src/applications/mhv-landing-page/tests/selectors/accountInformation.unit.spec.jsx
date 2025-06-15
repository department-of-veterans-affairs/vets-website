import { expect } from 'chai';
import {
  selectProfileLogInProvider,
  selectProfileLoa,
  selectVaPatient,
} from '../../selectors/accountInformation';

describe('accountInformation selectors', () => {
  describe('selectProfileLogInProvider', () => {
    it('should return the serviceName if profile has signIn', () => {
      const profile = { signIn: { serviceName: 'idme' } };
      expect(selectProfileLogInProvider({ profile })).to.equal('idme');
    });

    it('should return an empty string if profile has no signIn', () => {
      const profile = { signIn: null };
      expect(selectProfileLogInProvider({ profile })).to.equal('');
    });

    it('should return an empty string if profile is empty', () => {
      const profile = {};
      expect(selectProfileLogInProvider({ profile })).to.equal('');
    });
  });

  describe('selectProfileLoa', () => {
    it('should return the current LOA if profile has loa', () => {
      const profile = { loa: { current: 3 } };
      expect(selectProfileLoa({ profile })).to.equal(3);
    });

    it('should return null if profile has no loa', () => {
      const profile = { loa: null };
      expect(selectProfileLoa({ profile })).to.be.null;
    });

    it('should return null if profile is empty', () => {
      const profile = {};
      expect(selectProfileLoa({ profile })).to.be.null;
    });
  });

  describe('selectVaPatient', () => {
    it('should return the vaPatient status if profile has vaPatient', () => {
      const profile = { vaPatient: true };
      expect(selectVaPatient({ profile })).to.be.true;
    });

    it('should return undefined if profile has no vaPatient', () => {
      const profile = { vaPatient: null };
      expect(selectVaPatient({ profile })).to.be.null;
    });

    it('should return undefined if profile is empty', () => {
      const profile = {};
      expect(selectVaPatient({ profile })).to.be.undefined;
    });
  });
});
