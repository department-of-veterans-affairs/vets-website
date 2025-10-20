import React from 'react';
import PropTypes from 'prop-types';

import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const content = {
  formTitle: 'Apply for accrued benefits for a deceased beneficiary',
  formSubTitle:
    'Application for Accrued Amounts Due a Deceased Beneficiary (VA Form 21P-601)',
  authStartFormText: 'Start the application',
  unauthStartText: 'Sign in to start your application',
  displayNonVeteranMessaging: true,
};

const ombInfo = {
  resBurden: '30',
  ombNumber: '2900-0016',
  expDate: '8/31/2026',
};

const childContent = (
  <>
    <p>
      Use this form to apply for accrued benefits that were due to a VA
      beneficiary at the time of their death.
    </p>
    <h2>What are accrued benefits?</h2>
    <p>
      Accrued benefits are VA benefits that were due to a beneficiary at the
      time of death but were not paid prior to death. These benefits are payable
      to eligible survivors according to a specific order of succession
      established by law.
    </p>
    <va-alert status="info" uswds>
      <h3 slot="headline">Already filed for survivor benefits?</h3>
      <p>
        Do NOT complete this form if you have already applied for survivor
        benefits using VA Form 21P-534EZ or 21P-535. Those forms already include
        accrued benefits claims.
      </p>
    </va-alert>
    <h2>Who can use this form?</h2>
    <p>You can use this form if you are:</p>
    <ul>
      <li>The surviving spouse of a deceased veteran or beneficiary</li>
      <li>A child of a deceased veteran or beneficiary</li>
      <li>A dependent parent of a deceased veteran</li>
      <li>The executor or administrator of the deceased’s estate</li>
      <li>
        A creditor who paid expenses related to the last illness or burial
      </li>
    </ul>
    <va-alert status="warning" uswds>
      <h3 slot="headline">Time limit to apply</h3>
      <p>
        You must file this application within <strong>one year</strong> from the
        date of death. Exception: Lump sum accrued benefits claims must be filed
        within <strong>five years</strong> from the veteran’s date of death.
      </p>
    </va-alert>
    <h2>What you’ll need</h2>
    <ul>
      <li>
        The deceased’s full name, Social Security number, and VA file number
      </li>
      <li>Date of death</li>
      <li>Your relationship to the deceased</li>
      <li>Information about any surviving relatives</li>
      <li>Documentation of expenses (if claiming reimbursement)</li>
    </ul>
  </>
);

export const IntroductionPage = ({ route }) => {
  return (
    <IntroductionPageView
      route={route}
      content={content}
      ombInfo={ombInfo}
      childContent={childContent}
    />
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }),
};

export default IntroductionPage;
