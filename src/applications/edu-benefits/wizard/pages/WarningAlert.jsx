import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from './pageList';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

const WarningAOptions = [
  { label: 'Applying for a new benefit', value: 'yes' },
  {
    label: (
      <span className="radioText">
        Updating my program of study or place of training
      </span>
    ),
    value: 'no',
  },
  {
    label: (
      <span className="radioText">
        Applying to extend my Post-9/11 or Fry Scholarship benefits using the
        Edith Nourse Rogers STEM Scholarship
      </span>
    ),
    value: 'extend',
  },
];

const WarningAlert = ({
  setPageState,
  getPageStateFromPageName,
  state = {},
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
    pageNames.claimingBenefit,
  )?.selected;
  let headline;
  let content;

  if (
    newBenefitAnswer === 'yes' &&
    claimingBenefitOwnServiceAnswer === 'other' &&
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
  } else if (
    newBenefitAnswer === 'yes' &&
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
  }

  return <AlertBox headline={headline} content={content} status="warning" />;
};

export default {
  name: pageNames?.warningAlert,
  component: WarningAlert,
};
