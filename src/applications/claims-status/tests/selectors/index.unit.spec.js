import { expect } from 'chai';

import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
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

  describe('cstUseLighthouse', () => {
    context('when endpoint is show', () => {
      const endpoint = 'show';
      const cstUseLighthouseShow =
        FEATURE_FLAG_NAMES[`cstUseLighthouse#${endpoint}`];
      context('when featureToggles are true', () => {
        const state = {
          featureToggles: {
            [cstUseLighthouseShow]: true,
            // eslint-disable-next-line camelcase
            cst_use_lighthouse_5103: true,
          },
        };
        context('when cstFlipperOverrideMode is set to featureToggle', () => {
          it('should return true when window.cypress false', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'featureToggle');
            window.Cypress = false;
            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.true;
          });

          it('should return true when window.cypress true', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'featureToggle');
            window.Cypress = true;
            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.true;
          });
        });

        context('when cstFlipperOverrideMode is set to evss', () => {
          it('should return false', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'evss');
            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.false;
          });
        });

        context('when cstFlipperOverrideMode is set to lighthouse', () => {
          it('should return true', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'lighthouse');
            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.true;
          });
        });

        context('when cstFlipperOverrideMode is null', () => {
          it('should return true when window.cypress false', () => {
            // sessionStorage.setItem('cstFlipperOverrideMode', '');
            window.Cypress = false;
            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.true;
          });

          it('should return true when window.cypress true', () => {
            // sessionStorage.setItem('cstFlipperOverrideMode', '');
            window.Cypress = true;
            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.true;
          });
        });
      });

      context('when featureToggles are false', () => {
        const state = {
          featureToggles: {
            [cstUseLighthouseShow]: false,
            // eslint-disable-next-line camelcase
            cst_use_lighthouse_5103: false,
          },
        };
        context('when cstFlipperOverrideMode is set to featureToggle', () => {
          it('should return true when window.cypress false', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'featureToggle');
            window.Cypress = false;

            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.true;
          });

          it('should return true when window.cypress true', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'featureToggle');
            window.Cypress = true;

            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.false;
          });
        });

        context('when cstFlipperOverrideMode is set to evss', () => {
          it('should return false', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'evss');

            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.false;
          });
        });

        context('when cstFlipperOverrideMode is set to lighthouse', () => {
          it('should return true', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'lighthouse');

            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.true;
          });
        });

        context('when cstFlipperOverrideMode is null', () => {
          it('should return true when window.cypress false', () => {
            // sessionStorage.setItem('cstFlipperOverrideMode', '');
            window.Cypress = false;

            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.true;
          });

          it('should return true when window.cypress true', () => {
            // sessionStorage.setItem('cstFlipperOverrideMode', '');
            window.Cypress = true;

            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.false;
          });
        });
      });
    });

    context('when endpoint is index', () => {
      const endpoint = 'index';
      const cstUseLighthouseShow =
        FEATURE_FLAG_NAMES[`cstUseLighthouse#${endpoint}`];
      context('when featureToggles are true', () => {
        const state = {
          featureToggles: {
            [cstUseLighthouseShow]: true,
            // eslint-disable-next-line camelcase
            cst_use_lighthouse_5103: true,
          },
        };
        context('when cstFlipperOverrideMode is set to featureToggle', () => {
          it('should return true ', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'featureToggle');
            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.true;
          });
        });

        context('when cstFlipperOverrideMode is set to evss', () => {
          it('should return false', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'evss');
            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.false;
          });
        });

        context('when cstFlipperOverrideMode is set to lighthouse', () => {
          it('should return true', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'lighthouse');
            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.true;
          });
        });

        context('when cstFlipperOverrideMode is null', () => {
          it('should return true', () => {
            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.true;
          });
        });
      });

      context('when featureToggles are false', () => {
        const state = {
          featureToggles: {
            [cstUseLighthouseShow]: false,
            // eslint-disable-next-line camelcase
            cst_use_lighthouse_5103: false,
          },
        };
        context('when cstFlipperOverrideMode is set to featureToggle', () => {
          it('should return false', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'featureToggle');

            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.false;
          });
        });

        context('when cstFlipperOverrideMode is set to evss', () => {
          it('should return false', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'evss');

            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.false;
          });
        });

        context('when cstFlipperOverrideMode is set to lighthouse', () => {
          it('should return true', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'lighthouse');

            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.true;
          });
        });

        context('when cstFlipperOverrideMode is null', () => {
          it('should return false', () => {
            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.false;
          });
        });
      });
    });

    context('when endpoint is 5103', () => {
      const endpoint = '5103';
      const cstUseLighthouseShow =
        FEATURE_FLAG_NAMES[`cstUseLighthouse#${endpoint}`];
      context('when featureToggles are true', () => {
        const state = {
          featureToggles: {
            [cstUseLighthouseShow]: true,
            // eslint-disable-next-line camelcase
            cst_use_lighthouse_5103: true,
          },
        };
        context('when cstFlipperOverrideMode is set to featureToggle', () => {
          it('should return true ', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'featureToggle');
            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.true;
          });
        });

        context('when cstFlipperOverrideMode is set to evss', () => {
          it('should return false', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'evss');
            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.false;
          });
        });

        context('when cstFlipperOverrideMode is set to lighthouse', () => {
          it('should return true', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'lighthouse');
            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.true;
          });
        });

        context('when cstFlipperOverrideMode is null', () => {
          it('should return true', () => {
            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.true;
          });
        });
      });

      context('when featureToggles are false', () => {
        const state = {
          featureToggles: {
            [cstUseLighthouseShow]: false,
            // eslint-disable-next-line camelcase
            cst_use_lighthouse_5103: false,
          },
        };
        context('when cstFlipperOverrideMode is set to featureToggle', () => {
          it('should return false', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'featureToggle');

            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.false;
          });
        });

        context('when cstFlipperOverrideMode is set to evss', () => {
          it('should return false', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'evss');

            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.false;
          });
        });

        context('when cstFlipperOverrideMode is set to lighthouse', () => {
          it('should return true', () => {
            sessionStorage.setItem('cstFlipperOverrideMode', 'lighthouse');

            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.true;
          });
        });

        context('when cstFlipperOverrideMode is null', () => {
          it('should return false', () => {
            expect(selectors.cstUseLighthouse(state, endpoint)).to.be.false;
          });
        });
      });
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
