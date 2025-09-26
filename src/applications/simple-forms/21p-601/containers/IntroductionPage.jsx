import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

function IntroductionPage({ route }) {
  const { formConfig, pageList } = route;
  useEffect(() => {
    focusElement('.schemaform-title > h1');
  }, []);
  return (
    <article className="schemaform-intro">
      <FormTitle
        title="Application for Accrued Amounts Due a Deceased Beneficiary"
        subtitle="VA Form 21P-601"
      />

      <p className="va-introtext">
        Use this form to apply for accrued benefits that were due to a VA
        beneficiary at the time of their death.
      </p>

      <h2>What are accrued benefits?</h2>
      <p>
        Accrued benefits are VA benefits that were due to a beneficiary at the
        time of death but were not paid prior to death. These benefits are
        payable to eligible survivors according to a specific order of
        succession established by law.
      </p>

      <va-alert status="info" uswds>
        <h3 slot="headline">Already filed for survivor benefits?</h3>
        <p>
          Do NOT complete this form if you have already applied for survivor
          benefits using VA Form 21P-534EZ or 21P-535. Those forms already
          include accrued benefits claims.
        </p>
      </va-alert>

      <h2>Who can use this form?</h2>
      <p>You can use this form if you are:</p>
      <ul>
        <li>The surviving spouse of a deceased veteran or beneficiary</li>
        <li>A child of a deceased veteran or beneficiary</li>
        <li>A dependent parent of a deceased veteran</li>
        <li>The executor or administrator of the deceased's estate</li>
        <li>
          A creditor who paid expenses related to the last illness or burial
        </li>
      </ul>

      <va-alert status="warning" uswds>
        <h3 slot="headline">Time limit to apply</h3>
        <p>
          You must file this application within <strong>one year</strong> from
          the date of death. Exception: Lump sum accrued benefits claims must be
          filed within <strong>five years</strong> from the veteran's date of
          death.
        </p>
      </va-alert>

      <h2>What you'll need</h2>
      <ul>
        <li>
          The deceased's full name, Social Security number, and VA file number
        </li>
        <li>Date of death</li>
        <li>Your relationship to the deceased</li>
        <li>Information about any surviving relatives</li>
        <li>Documentation of expenses (if claiming reimbursement)</li>
      </ul>

      <SaveInProgressIntro
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        startText="Start the application"
        formConfig={formConfig}
      />

      <va-omb-info
        res-burden={30}
        omb-number="2900-0016"
        exp-date="08/31/2026"
      />
    </article>
  );
}

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
    }).isRequired,
    pageList: PropTypes.array.isRequired,
  }).isRequired,
};

export default IntroductionPage;
