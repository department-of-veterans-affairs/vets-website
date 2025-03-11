import { expect } from 'chai';

import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';

import * as selectors from '../../selectors';

describe('selectors', () => {
  describe('isLoadingFeatures', () => {
    const state = {
      featureToggles: {
        loading: true,
      },
    };

    it('should return true', () => {
      expect(selectors.isLoadingFeatures(state)).to.be.true;
    });

    it('should return false', () => {
      state.featureToggles.loading = false;

      expect(selectors.isLoadingFeatures(state)).to.be.false;
    });
  });

  describe('showClaimLettersFeature', () => {
    const state = {
      featureToggles: {
        claimLettersAccess: true,
        // eslint-disable-next-line camelcase
        claim_letters_access: true,
      },
    };

    it('should return true', () => {
      expect(selectors.showClaimLettersFeature(state)).to.be.true;
    });

    it('should return false', () => {
      state.featureToggles.claimLettersAccess = false;
      // eslint-disable-next-line camelcase
      state.featureToggles.claim_letters_access = false;

      expect(selectors.showClaimLettersFeature(state)).to.be.false;
    });
  });

  describe('cstIncludeDdlBoaLetters', () => {
    const state = {
      featureToggles: {
        cstIncludeDdlBoaLetters: true,
        // eslint-disable-next-line camelcase
        cst_include_ddl_boa_letters: true,
      },
    };

    it('should return true', () => {
      expect(selectors.cstIncludeDdlBoaLetters(state)).to.be.true;
    });

    it('should return false', () => {
      state.featureToggles.cstIncludeDdlBoaLetters = false;
      // eslint-disable-next-line camelcase
      state.featureToggles.cst_include_ddl_boa_letters = false;

      expect(selectors.cstIncludeDdlBoaLetters(state)).to.be.false;
    });
  });

  describe('cstIncludeDdl5103Letters', () => {
    const state = {
      featureToggles: {
        cstIncludeDdl5103Letters: true,
        // eslint-disable-next-line camelcase
        cst_include_ddl_5103_letters: true,
      },
    };

    it('should return true', () => {
      expect(selectors.cstIncludeDdl5103Letters(state)).to.be.true;
    });

    it('should return false', () => {
      state.featureToggles.cstIncludeDdl5103Letters = false;
      // eslint-disable-next-line camelcase
      state.featureToggles.cst_include_ddl_5103_letters = false;

      expect(selectors.cstIncludeDdl5103Letters(state)).to.be.false;
    });
  });

  describe('benefitsDocumentsUseLighthouse', () => {
    const state = {
      featureToggles: {
        benefitsDocumentsUseLighthouse: true,
        // eslint-disable-next-line camelcase
        benefits_documents_use_lighthouse: true,
      },
    };

    it('should return true', () => {
      expect(selectors.benefitsDocumentsUseLighthouse(state)).to.be.true;
    });

    it('should return false', () => {
      state.featureToggles.benefitsDocumentsUseLighthouse = false;
      // eslint-disable-next-line camelcase
      state.featureToggles.benefits_documents_use_lighthouse = false;

      expect(selectors.benefitsDocumentsUseLighthouse(state)).to.be.false;
    });
  });

  describe('getBackendServices', () => {
    const state = {
      user: {
        profile: {
          services: [backendServices.APPEALS_STATUS],
        },
      },
    };

    it('should include backend services', () => {
      expect(selectors.getBackendServices(state)).to.contain(
        backendServices.APPEALS_STATUS,
      );
    });
  });
});
