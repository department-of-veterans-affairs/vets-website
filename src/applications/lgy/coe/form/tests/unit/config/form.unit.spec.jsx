import { expect } from 'chai';
import formConfig from '../../../config/form';
import { serviceStatuses } from '../../../constants';

describe('COE form config Step 2 conditional pages', () => {
  const { pages } = formConfig.chapters.serviceHistoryChapter;

  it('shows pre-discharge and purple heart pages only for ADSM when flag is enabled', () => {
    const formData = {
      'view:coeFormRebuildCveteam': true,
      identity: serviceStatuses.ADSM,
    };
    expect(pages.pendingPredischargeClaimPage.depends(formData)).to.equal(true);
    expect(pages.purpleHeartRecipientPage.depends(formData)).to.equal(true);
  });

  it('skips pre-discharge and purple heart pages for non-ADSM when flag is enabled', () => {
    const formData = {
      'view:coeFormRebuildCveteam': true,
      identity: serviceStatuses.VETERAN,
    };
    expect(pages.pendingPredischargeClaimPage.depends(formData)).to.equal(
      false,
    );
    expect(pages.purpleHeartRecipientPage.depends(formData)).to.equal(false);
  });

  it('skips pre-discharge and purple heart pages when flag is disabled, regardless of identity', () => {
    const formData = {
      'view:coeFormRebuildCveteam': false,
      identity: serviceStatuses.ADSM,
    };
    expect(pages.pendingPredischargeClaimPage.depends(formData)).to.equal(
      false,
    );
    expect(pages.purpleHeartRecipientPage.depends(formData)).to.equal(false);
  });

  it('still shows disability separation page when flag is enabled', () => {
    const formData = {
      'view:coeFormRebuildCveteam': true,
      identity: serviceStatuses.VETERAN,
    };
    expect(pages.disabilitySeparationPage.depends(formData)).to.equal(true);
  });
});
