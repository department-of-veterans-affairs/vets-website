import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

const OMB_RES_BURDEN = 4;
const OMB_NUMBER = '2900-0648';
const OMB_EXP_DATE = '03/31/2027';

const IntroductionPage = ({ route }) => {
  const { formConfig, pageList } = route;
  const { customText, formId, prefillEnabled, savedFormMessages } = formConfig;

  const sipIntroProps = useMemo(
    () => ({
      unauthStartText: 'Sign in to start your form',
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
        title="Register for the Foreign Medical Program (FMP)"
        subTitle="FMP Registration Form (VA Form 10-7959f-1)"
      />
      <p className="va-introtext">
        If you’re a Veteran who gets medical care outside the U.S. for a
        service-connected condition, we may cover the cost of your care through
        the Foreign Medical Program (FMP). Use this form to register for the
        Foreign Medical Program.
      </p>

      <h2>What to know before you fill out this form</h2>
      <ul>
        <li>You’ll need your Social Security number or your VA file number.</li>
        <li>
          After you register, we’ll send you a benefits authorization letter.
          This letter will list your service-connected conditions that we’ll
          cover.
        </li>
      </ul>

      <div className="vads-u-margin-y--4">
        <SaveInProgressIntro {...sipIntroProps} />
      </div>

      <va-omb-info
        res-burden={OMB_RES_BURDEN}
        omb-number={OMB_NUMBER}
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
