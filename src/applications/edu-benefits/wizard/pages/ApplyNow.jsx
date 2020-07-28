import React, { useState, useEffect } from 'react';
import { pageNames } from './pageList';
import {
  WIZARD_STATUS_COMPLETE,
  getReferredBenefit,
  FORM_ID_0994,
} from '../../../static-pages/wizard/';

const ApplyNow = ({
  setPageState,
  getPageStateFromPageName,
  state = {},
  setWizardCompletionStatus,
  recordWizardEvent,
}) => {
  const [url, setUrl] = useState('');
  const [referredBenefit, setReferredBenefit] = useState('');

  useEffect(
    () => {
      const getTheReferredBenefit = async () => {
        const referredBenefitValue = await getReferredBenefit();
        setReferredBenefit(referredBenefitValue);
      };
      getTheReferredBenefit();
    },
    [referredBenefit],
  );

  useEffect(
    () => {
      const getUrl = () => {
        if (referredBenefit) {
          setUrl(
            referredBenefit === FORM_ID_0994
              ? `/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994`
              : `/education/apply-for-education-benefits/application/${referredBenefit}`,
          );
        }
      };
      getUrl();
    },
    [referredBenefit, url],
  );

  return (
    <a
      id="apply-now-link"
      href={url}
      className="usa-button va-button-primary"
      onClick={e => {
        if (window.location.pathname.includes(referredBenefit)) {
          e.preventDefault();
        }
        setWizardCompletionStatus(WIZARD_STATUS_COMPLETE);
        const eduBenefitEventDetails = {
          // event: 'edu-howToApply-applyNow',
          // 'edu-benefitUpdate': this.eduFormChange(this.state.newBenefit),
          // 'edu-isBenefitClaimForSelf': this.isBenefitClaimForSelf(
          //   this.state.serviceBenefitBasedOn,
          // ),
          // 'edu-isNationalCallToServiceBenefit': this.state
          //   .nationalCallToService,
          // 'edu-isVetTec': this.state.vetTecBenefit,
          // 'edu-hasSponsorTransferredBenefits': this.state
          //   .sponsorTransferredBenefits,
          // 'edu-isReceivingSponsorBenefits': this.isReceivingSponsorBenefits(
          //   this.state.transferredEduBenefits,
          // ),
          // 'edu-isSponsorReachable': this.state.sponsorDeceasedDisabledMIA,
          // 'edu-stemApplicant': this.state.applyForScholarship,
        };
        recordWizardEvent(eduBenefitEventDetails);
      }}
    >
      Apply now
    </a>
  );
};

export default {
  name: pageNames?.applyNow,
  component: ApplyNow,
};
