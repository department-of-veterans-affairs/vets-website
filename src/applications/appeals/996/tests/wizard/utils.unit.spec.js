import moment from 'moment';
import { expect } from 'chai';

import {
  WIZARD_STATUS_COMPLETE,
  WIZARD_STATUS_RESTARTING,
} from 'platform/site-wide/wizard';

import {
  setHlrWizardStatus,
  removeHlrWizardStatus,
  shouldShowWizard,
} from '../../wizard/utils';

describe('wizard utils', () => {
  describe('shouldShowWizard', () => {
    afterEach(() => {
      removeHlrWizardStatus();
    });

    // future date using unix seconds from epoch
    const expiresAt = moment()
      .add(1, 'day')
      .unix();

    it('should return false when there is a saved form', () => {
      removeHlrWizardStatus();
      const savedForm = [{ form: '22', metaData: { expiresAt } }];
      expect(shouldShowWizard('22', savedForm)).to.be.false;
    });
    it('should return false when wizard completes with a saved form', () => {
      setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
      const savedForm = [{ form: '22', metaData: { expiresAt } }];
      expect(shouldShowWizard('22', savedForm)).to.be.false;
    });
    it('should return false when wizard completes with no saved form', () => {
      setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
      expect(shouldShowWizard('22', [])).to.be.false;
    });
    it('should return false when wizard is not restarting', () => {
      setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
      const savedForm = [{ form: '22', metaData: { expiresAt } }];
      expect(shouldShowWizard('22', savedForm)).to.be.false;
    });

    it('should return true with no arguments', () => {
      expect(shouldShowWizard()).to.be.true;
    });
    it('should return true when the wizard is not complete & there is no saved form', () => {
      removeHlrWizardStatus();
      expect(shouldShowWizard('22', [])).to.be.true;
    });
    it('should return true when wizard is complete and is restarting', () => {
      setHlrWizardStatus(WIZARD_STATUS_RESTARTING);
      const savedForm = [{ form: '22', metaData: { expiresAt } }];
      expect(shouldShowWizard('22', savedForm)).to.be.true;
    });
  });
});
