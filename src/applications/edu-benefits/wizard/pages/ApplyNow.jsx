import React, { useState, useEffect } from 'react';
import { pageNames } from './pageList';
import {
  WIZARD_STATUS_COMPLETE,
  getReferredBenefit,
  formIdSuffixes,
} from 'applications/static-pages/wizard/';
import recordEvent from 'platform/monitoring/record-event';

const ApplyNow = ({
  setPageState,
  getPageStateFromPageName,
  state = {},
  setWizardStatus,
}) => {
  const [url, setUrl] = useState('');
  const [referredBenefit, setReferredBenefit] = useState('');
  const newBenefitAnswer = getPageStateFromPageName(pageNames.newBenefit)
    ?.selected;
  const claimingBenefitAnswer = getPageStateFromPageName(
    pageNames.claimingBenefitOwnService,
  )?.selected;
  const nationalCallToServiceAnswer = getPageStateFromPageName(
    pageNames.nationalCallToService,
  )?.selected;
  const sponsorDeceasedAnswer = getPageStateFromPageName(
    pageNames.sponsorDeceased,
  )?.selected;
  const vetTecAnswer = getPageStateFromPageName(pageNames.vetTec)?.selected;
  const STEMScholarshipAnswer = getPageStateFromPageName(
    pageNames.STEMScholarship,
  )?.selected;
  const transferredBenefitsAnswer = getPageStateFromPageName(
    pageNames.transferredBenefits,
  )?.selected;
  let hasSponsoredTransferredBenefitsAnswer;
  let receivingSponsorBenefitsAnswer;
  if (
    transferredBenefitsAnswer === 'yes' ||
    transferredBenefitsAnswer === 'no'
  ) {
    hasSponsoredTransferredBenefitsAnswer = transferredBenefitsAnswer;
  } else if (
    transferredBenefitsAnswer === 'own' ||
    transferredBenefitsAnswer === 'transferred' ||
    transferredBenefitsAnswer === 'fry'
  ) {
    receivingSponsorBenefitsAnswer = transferredBenefitsAnswer;
  }
  useEffect(() => {
    const updateUrl = async () => {
      const updatedBenefit = await getReferredBenefit();
      const { FORM_ID_0994 } = formIdSuffixes;
      setReferredBenefit(updatedBenefit);
      if (updatedBenefit) {
        setUrl(
          updatedBenefit === FORM_ID_0994
            ? `/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994`
            : `/education/apply-for-education-benefits/application/${updatedBenefit}`,
        );
      }
    };
    updateUrl();
  });

  return (
    <a
      id="apply-now-link"
      href={url}
      className="usa-button va-button-primary"
      onClick={e => {
        if (window.location.pathname.includes(referredBenefit)) {
          e.preventDefault();
        }
        setWizardStatus(WIZARD_STATUS_COMPLETE);
        const eduBenefitEventDetails = {
          event: 'edu-howToApply-applyNow',
          'edu-benefitUpdate': newBenefitAnswer,
          'edu-isBenefitClaimForSelf': claimingBenefitAnswer,
          'edu-isNationalCallToServiceBenefit': nationalCallToServiceAnswer,
          'edu-isVetTec': vetTecAnswer,
          'edu-hasSponsorTransferredBenefits': hasSponsoredTransferredBenefitsAnswer,
          'edu-isReceivingSponsorBenefits': receivingSponsorBenefitsAnswer,
          'edu-isSponsorReachable': sponsorDeceasedAnswer,
          'edu-stemApplicant': STEMScholarshipAnswer,
        };
        recordEvent(eduBenefitEventDetails);
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
