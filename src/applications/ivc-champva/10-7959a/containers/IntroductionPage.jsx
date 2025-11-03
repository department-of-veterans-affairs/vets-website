import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { VaLink } from '../utils/imports';

const OMB_RES_BURDEN = 10;
const OMB_NUM = '2900-0219';
const OMB_EXP_DATE = '12/31/2027';

const IntroductionPage = ({ route }) => {
  const { formConfig, pageList } = route;
  const { customText, formId, prefillEnabled, savedFormMessages } = formConfig;

  const sipIntroProps = useMemo(
    () => ({
      alertTitle: 'Sign in now to save time and save your work in progress',
      unauthStartText: 'Sign in to start your claim',
      messages: savedFormMessages,
      hideUnauthedStartLink: false,
      formConfig: { customText },
      headingLevel: 2,
      prefillEnabled,
      pageList,
      formId,
    }),
    [customText, formId, pageList, prefillEnabled, savedFormMessages],
  );

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  return (
    <div className="schemaform-intro">
      <FormTitle
        title="File a CHAMPVA claim"
        subTitle="CHAMPVA Claim Form (VA Form 10-7959a)"
      />
      <p className="va-introtext">
        Use this form if you’re currently enrolled in the Civilian Health and
        Medical Program of the Department of Veterans Affairs (CHAMPVA) and want
        to file a claim for reimbursement.
      </p>
      <h2>What to know before you fill out this form</h2>
      <ul>
        <li>
          You must file your claim within <strong>1 year</strong> of when you
          got the care. If you stayed at a hospital for care, you must file your
          claim within <strong>1 year</strong> of when you left the hospital.
        </li>
        <li>
          Each claim needs its own form. If you need to submit more than one
          claim, you’ll need to submit a new form for each claim.
        </li>
        <li>
          You’ll need to submit separate claims for each beneficiary, even if
          they’re members of the same family.
        </li>
        <li>
          You’ll also need to submit supporting documents with your claim, like
          an itemized billing statement, an explanation of benefits (EOB) from
          another insurance provider, or a pharmacy receipt.
        </li>
      </ul>
      <p className="vads-u-margin-bottom--4">
        <VaLink
          href="/COMMUNITYCARE/programs/dependents/champva/champva-claim.asp"
          text="Find out which supporting documents to submit with your claim"
        />
      </p>
      <div className="vads-u-margin-y--4">
        <SaveInProgressIntro {...sipIntroProps} />
      </div>
      <va-omb-info
        res-burden={OMB_RES_BURDEN}
        omb-number={OMB_NUM}
        exp-date={OMB_EXP_DATE}
      />
    </div>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    pageList: PropTypes.array,
    formConfig: PropTypes.shape({
      customText: PropTypes.object,
      formId: PropTypes.string,
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
    }),
  }).isRequired,
};

export default IntroductionPage;
