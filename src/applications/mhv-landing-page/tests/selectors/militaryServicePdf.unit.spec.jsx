import { expect } from 'chai';
import {
  militaryServiceLoading,
  militaryServiceSuccessfulDownload,
  militaryServiceFailedDownload,
} from '../../selectors';
import { appName } from '../../manifest.json';

describe(`${appName} -- militaryServicePdf selectors`, () => {
  describe('militaryServiceLoading', () => {
    it('returns true when loading', () => {
      const state = {
        myHealth: {
          militaryServicePdf: {
            loading: true,
          },
        },
      };
      const result = militaryServiceLoading(state);
      expect(result).to.be.true;
    });

    it('returns false when not loading', () => {
      const state = {
        myHealth: {
          militaryServicePdf: {
            loading: false,
          },
        },
      };
      const result = militaryServiceLoading(state);
      expect(result).to.be.false;
    });
  });
  describe('militaryServiceSuccessfulDownload', () => {
    it('returns true when successfulDownload', () => {
      const state = {
        myHealth: {
          militaryServicePdf: {
            successfulDownload: true,
          },
        },
      };
      const result = militaryServiceSuccessfulDownload(state);
      expect(result).to.be.true;
    });

    it('returns false when not successfulDownload', () => {
      const state = {
        myHealth: {
          militaryServicePdf: {
            successfulDownload: false,
          },
        },
      };
      const result = militaryServiceSuccessfulDownload(state);
      expect(result).to.be.false;
    });
  });
  describe('militaryServiceFailedDownload', () => {
    it('returns true when failedDownload', () => {
      const state = {
        myHealth: {
          militaryServicePdf: {
            failedDownload: true,
          },
        },
      };
      const result = militaryServiceFailedDownload(state);
      expect(result).to.be.true;
    });

    it('returns false when not failedDownload', () => {
      const state = {
        myHealth: {
          militaryServicePdf: {
            failedDownload: false,
          },
        },
      };
      const result = militaryServiceFailedDownload(state);
      expect(result).to.be.false;
    });
  });
});
