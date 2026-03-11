import { expect } from 'chai';
import {
  seiLoading,
  seiFailedDomains,
  seiSuccessfulDownload,
  seiFailedDownload,
} from '../../selectors';
import { appName } from '../../manifest.json';

describe(`${appName} -- seiPdf selectors`, () => {
  describe('seiLoading', () => {
    it('returns true when loading', () => {
      const state = {
        myHealth: {
          seiPdf: {
            loading: true,
          },
        },
      };
      const result = seiLoading(state);
      expect(result).to.be.true;
    });

    it('returns false when not loading', () => {
      const state = {
        myHealth: {
          seiPdf: {
            loading: false,
          },
        },
      };
      const result = seiLoading(state);
      expect(result).to.be.false;
    });
  });
  describe('seiSuccessfulDownload', () => {
    it('returns true when successfulDownload', () => {
      const state = {
        myHealth: {
          seiPdf: {
            successfulDownload: true,
          },
        },
      };
      const result = seiSuccessfulDownload(state);
      expect(result).to.be.true;
    });

    it('returns false when not successfulDownload', () => {
      const state = {
        myHealth: {
          seiPdf: {
            successfulDownload: false,
          },
        },
      };
      const result = seiSuccessfulDownload(state);
      expect(result).to.be.false;
    });
  });
  describe('seiFailedDownload', () => {
    it('returns true when failedDownload', () => {
      const state = {
        myHealth: {
          seiPdf: {
            failedDownload: true,
          },
        },
      };
      const result = seiFailedDownload(state);
      expect(result).to.be.true;
    });

    it('returns false when not failedDownload', () => {
      const state = {
        myHealth: {
          seiPdf: {
            failedDownload: false,
          },
        },
      };
      const result = seiFailedDownload(state);
      expect(result).to.be.false;
    });
  });
  describe('seiFailedDomains', () => {
    const failedDomainsArray = ['domain1', 'domain2'];
    it('returns "failedDomins" value', () => {
      const state = {
        myHealth: {
          seiPdf: {
            failedDomains: failedDomainsArray,
          },
        },
      };
      const result = seiFailedDomains(state);
      expect(result).to.eq(failedDomainsArray);
    });
  });
});
