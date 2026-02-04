import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import { Toggler } from 'platform/utilities/feature-toggles';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { VaLink } from '../utils/imports';

const OMB_RES_BURDEN = 10;
const OMB_NUM = '2900-0219';
const OMB_EXP_DATE = '12/31/2027';

const supportingDocsLink = (
  <p className="vads-u-margin-bottom--4">
    <VaLink
      href="/resources/how-to-file-a-champva-claim/#supporting-documents-to-send-w"
      text="Find out which supporting documents to submit with your claim"
    />
  </p>
);

const processDescription = (
  <>
    <ul>
      <li>
        You must file your claim within <strong>1 year</strong> of when you got
        the care. If you stayed at a hospital for care, you must file your claim
        within <strong>1 year</strong> of when you left the hospital.
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
        You’ll also need to submit supporting documents with your claim, like an
        itemized billing statement, an explanation of benefits (EOB) from
        another insurance provider, or a pharmacy receipt.
      </li>
    </ul>
    {supportingDocsLink}
  </>
);

const processDescriptionResubmit = (
  <>
    <ul>
      <li>
        You must file your claim within <strong>1 year</strong> of when you got
        the care. If you stayed at a hospital for care, you must file your claim
        within <strong>1 year</strong> of when you left the hospital.
      </li>
      <li>
        Each claim or resubmitted claim needs its own form. If you need to
        submit more than 1 claim, you’ll need to submit a separate form for each
        claim.
      </li>
      <li>
        You’ll need to submit separate claims for each beneficiary, even if
        they’re members of the same family.
      </li>
    </ul>

    <h3>If this is your first time submitting a CHAMPVA claim</h3>
    <ul>
      <li>
        You’ll need to submit supporting documents with your claim. This could
        include an <strong>itemized billing statement</strong>, an{' '}
        <strong>explanation of benefits</strong> (EOB) from another insurance
        provider, or a <strong>pharmacy receipt.</strong>
      </li>
    </ul>
    {supportingDocsLink}

    <h3>If you received a letter asking for additional documentation</h3>
    <ul>
      <li>
        You’ll need to submit a claim online again. Select{' '}
        <strong>A resubmission for an existing claim.</strong>
      </li>
      <li>
        If you received a letter, enter the PDI# listed on the letter when
        prompted on the <strong>Your claim identification number</strong>{' '}
        screen.
      </li>
      <li>
        If you received a CHAMPVA EOB, enter the claim control number. You’ll
        also need to upload a copy of the EOB and any missing documents.
      </li>
    </ul>
  </>
);

const IntroductionPage = ({ route }) => {
  const { formConfig, pageList } = route;
  const { customText, formId, prefillEnabled, savedFormMessages } = formConfig;

  const sipIntroProps = useMemo(
    () => ({
      unauthStartText: 'Sign in to start your claim',
      messages: savedFormMessages,
      formConfig: { customText },
      headingLevel: 2,
      prefillEnabled,
      pageList,
      formId,
    }),
    [customText, formId, pageList, prefillEnabled, savedFormMessages],
  );

  useEffect(() => focusElement('.schemaform-intro h1'), []);

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
        <Toggler
          toggleName={Toggler.TOGGLE_NAMES.champvaEnableClaimResubmitQuestion}
        >
          <Toggler.Enabled>
            {' '}
            Or if you need to submit additional documentation for a claim you
            already filed.
          </Toggler.Enabled>
        </Toggler>
      </p>
      <h2>What to know before you fill out this form</h2>
      <Toggler
        toggleName={Toggler.TOGGLE_NAMES.champvaEnableClaimResubmitQuestion}
      >
        <Toggler.Enabled>{processDescriptionResubmit}</Toggler.Enabled>
        <Toggler.Disabled>{processDescription}</Toggler.Disabled>
      </Toggler>
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
