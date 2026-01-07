import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isLOA1, isLOA3 } from 'platform/user/selectors';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import VerifyAlert from 'platform/user/authorization/components/VerifyAlert';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { directDepositSetupInfo } from '../components/FormDescriptions/PaymentSelectionDescription';

const OMB_RES_BURDEN = 11;
const OMB_NUM = '2900-0648';
const OMB_EXP_DATE = '03/31/2027';

const IntroductionPage = ({ route }) => {
  const { formConfig, pageList } = route;
  const { customText, formId, prefillEnabled, savedFormMessages } = formConfig;

  const isUserLOA1 = useSelector(isLOA1);
  const isUserLOA3 = useSelector(isLOA3);

  const sipIntroProps = useMemo(
    () => ({
      alertTitle: 'Sign in now to save time and save your work in progress',
      unauthStartText: 'Sign in to start your claim',
      messages: savedFormMessages,
      hideUnauthedStartLink: true,
      formConfig: { customText },
      headingLevel: 2,
      prefillEnabled,
      pageList,
      formId,
    }),
    [customText, formId, pageList, prefillEnabled, savedFormMessages],
  );

  const pageContent = useMemo(
    () => (
      <>
        <p className="va-introtext">
          If you’re a Veteran who gets medical care outside the U.S. for a
          service-connected condition, we may cover the cost of your care
          through the Foreign Medical Program (FMP). Use this form to file a
          claim with FMP.
        </p>
        <h2 className="vads-u-font-size--h3">
          What to know before you fill out this form
        </h2>
        <p>When you prepare to file, be sure to have these on hand:</p>
        <ul>
          <li>
            You’ll need to upload an itemized billing statement to support your
            claim
          </li>
          <li>
            If you already paid the provider, you’ll need to upload a receipt or
            other proof that you paid
          </li>
          <li>
            For certain types of claims, you may need other supporting documents
          </li>
        </ul>
        <p className="vads-u-margin-bottom--4">
          <va-link
            text="Find out which supporting documents you need"
            href="/health-care/file-foreign-medical-program-claim/#supporting-documents-to-send-w"
          />
        </p>
        {isUserLOA3 && (
          <va-alert status="info" data-testid="fmp-direct-deposit-alert">
            <h2 slot="headline">Set up direct deposit</h2>
            {directDepositSetupInfo}
          </va-alert>
        )}
        <div className="vads-u-margin-y--4">
          <SaveInProgressIntro {...sipIntroProps} />
        </div>
        <va-omb-info
          res-burden={OMB_RES_BURDEN}
          omb-number={OMB_NUM}
          exp-date={OMB_EXP_DATE}
        />
      </>
    ),
    [isUserLOA3, sipIntroProps],
  );

  const identityAlert = useMemo(() => <VerifyAlert headingLevel={2} />, []);

  return (
    <div className="schemaform-intro">
      <FormTitle
        title="File a Foreign Medical Program (FMP) claim"
        subTitle="FMP Claim Cover Sheet (VA Form 10-7959f-2)"
      />
      {isUserLOA1 ? identityAlert : pageContent}
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
