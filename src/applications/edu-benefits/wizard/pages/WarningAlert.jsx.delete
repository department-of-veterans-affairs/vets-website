import React, { useState, useEffect } from 'react';
import { pageNames } from './pageList';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import { formIdSuffixes } from 'applications/static-pages/wizard/';

const WarningAlert = ({
  setPageState,
  getPageStateFromPageName,
  setReferredBenefit,
}) => {
  const newBenefitAnswer = getPageStateFromPageName(pageNames.newBenefit)
    ?.selected;
  const nationalCallToServiceAnswer = getPageStateFromPageName(
    pageNames.nationalCallToService,
  )?.selected;
  const sponsorDeceasedAnswer = getPageStateFromPageName(
    pageNames.sponsorDeceased,
  )?.selected;
  const transferredBenefitsAnswer = getPageStateFromPageName(
    pageNames.transferredBenefits,
  )?.selected;
  const claimingBenefitOwnServiceAnswer = getPageStateFromPageName(
    pageNames.claimingBenefitOwnService,
  )?.selected;
  const [applyPageRendered, setApplyPageRendered] = useState(false);
  let headline;
  let content;
  let formId;
  if (
    claimingBenefitOwnServiceAnswer === 'no' &&
    sponsorDeceasedAnswer === 'no' &&
    transferredBenefitsAnswer === 'no'
  ) {
    headline =
      "Your application can't be approved until your sponsor transfers their benefits.";
    content = (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://milconnect.dmdc.osd.mil/milconnect/public/faq/Education_Benefits-How_to_Transfer_Benefits"
      >
        Instructions for your sponsor to transfer education benefits.
      </a>
    );
    const { FORM_ID_1990E } = formIdSuffixes;
    formId = FORM_ID_1990E;
  } else if (
    newBenefitAnswer === 'new' &&
    claimingBenefitOwnServiceAnswer === 'yes' &&
    nationalCallToServiceAnswer === 'yes'
  ) {
    headline = 'Are you sure?';
    content = (
      <>
        <p>Are all of the following things true of your service?</p>
        <ul>
          <li>
            Enlisted under the National Call to Service program,{' '}
            <strong>and</strong>
          </li>
          <li>
            Entered service between 10/01/03 and 12/31/07, <strong>and</strong>
          </li>
          <li>Chose education benefits</li>
        </ul>
      </>
    );
    const { FORM_ID_1990N } = formIdSuffixes;
    formId = FORM_ID_1990N;
  }
  useEffect(
    () => {
      if (!applyPageRendered) {
        setReferredBenefit(formId);
        setPageState({}, pageNames.applyNow);
        setApplyPageRendered(true);
      }
    },
    [applyPageRendered, setPageState, formId, setReferredBenefit],
  );
  return <AlertBox headline={headline} content={content} status="warning" />;
};

export default {
  name: pageNames?.warningAlert,
  component: WarningAlert,
};
