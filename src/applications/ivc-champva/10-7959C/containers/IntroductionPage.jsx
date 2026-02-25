import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

const OMB_RES_BURDEN = 10;
const OMB_NUM = '2900-0219';
const OMB_EXP_DATE = '12/31/2027';

const IntroductionPage = ({ route }) => {
  const { formConfig, pageList } = route;
  const { formId, prefillEnabled, savedFormMessages } = formConfig;

  const sipIntroProps = useMemo(
    () => ({
      unauthStartText: 'Sign in to start your form',
      messages: savedFormMessages,
      headingLevel: 2,
      formConfig,
      prefillEnabled,
      pageList,
      formId,
    }),
    [formConfig, formId, pageList, prefillEnabled, savedFormMessages],
  );

  useEffect(() => focusElement('.schemaform-intro h1'), []);

  return (
    <div className="schemaform-intro">
      <FormTitle
        title="Submit other health insurance"
        subTitle="CHAMPVA Other Health Insurance Certification (VA Form 10-7959c)"
      />

      <p className="va-introtext">
        Use this form if you’re applying for Civilian Health and Medical Program
        of the Department of Veterans Affairs (CHAMPVA) benefits and have other
        non-VA health insurance. You can also use this form to report changes in
        your non-VA health insurance or your personal information, like your
        address or phone number.
      </p>

      <h2>What to know before you fill out this form</h2>
      <p>
        If you’re applying for CHAMPVA benefits for the first time, here’s what
        you’ll need to provide:
      </p>
      <ul>
        <li>
          <strong>Personal information.</strong> This includes your phone number
          and address.
        </li>
        <li>
          <strong>Insurance information.</strong> This includes any non-VA
          health insurance companies that cover you. You may need to upload
          supporting documents, like copies of your Medicare cards, other health
          insurance cards, schedule of benefits and co-payment documents. Be
          sure to include any secondary or supplemental insurance such as
          vision, dental or accidental insurance.
        </li>
      </ul>

      <p>
        <strong>If you’re already receiving CHAMPVA benefits,</strong> you can
        provide updated personal information, like your phone number and
        address.
      </p>
      <p>
        You can also provide your updated non-VA health insurance information
        and copies of your Medicare or other health insurance cards.
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
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
    formConfig: PropTypes.shape({
      customText: PropTypes.object.isRequired,
      formId: PropTypes.string.isRequired,
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
};

export default IntroductionPage;
