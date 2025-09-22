import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { useSelector } from 'react-redux';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { TITLE, SUBTITLE } from '../constants';

const OMB_RES_BURDEN = 5;
const OMB_NUMBER = '2900-0079';
const OMB_EXP_DATE = '8/31/2027';

const IntroContent = () => {
  return (
    <>
      <p>
        Use VA Form 21-4140 if we asked you to verify your employment status
        because you currently receive Individual Unemployment (IU) disability
        service-connected conditions
      </p>

      <h2>What to know before you fill out this form</h2>
      <ul>
        <li>
          You need to submit this form because the Social Security
          Administration reported that you earned income while receiving IU
          benefits
        </li>
        <li>
          You need to complete this form within 65 days of the notice you
          received
        </li>
        <li>You’ll need your Social Security number or your VA file number</li>
        <li>
          After you submit this form we’ll review it and advise you of your
          decision and your options
        </li>
      </ul>

      <h2>What you’ll need to report</h2>
      <p>
        Depending on your income source, you’ll also need to provide the
        following:
      </p>
      <ul>
        <li>
          Information about any employers or employment you’ve had in the past
          12 months
        </li>
        <li>
          <strong>
            If your income was from your spouse and taxes were filed jointly
          </strong>
          , documentation of the income source, such as a spouse’s W-2 or wage
          and tax statement
        </li>
        <li>
          <strong>If you’re no longer employed</strong>, evidence of when you
          stopped working, such as a statement from your former employer with
          the last day you worked
        </li>
        <li>
          <strong>
            If you’re currently employed but haven’t worked for a continuous
            year
          </strong>
          , evidence of your employment status, such as a statement from your
          employer with the dates you worked
        </li>
      </ul>
    </>
  );
};

export const IntroductionPage = props => {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));
  const { route } = props;
  const { formConfig, pageList } = route;
  const showVerifyIdentify = userLoggedIn && !userIdVerified;

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <IntroContent />
      {showVerifyIdentify ? (
        <div>{/* add verify identity alert if applicable */}</div>
      ) : (
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the application"
          devOnly={{
            forceShowFormControls: true,
          }}
        />
      )}
      <p />
      <va-omb-info
        res-burden={OMB_RES_BURDEN}
        omb-number={OMB_NUMBER}
        exp-date={OMB_EXP_DATE}
      />
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
};

export default IntroductionPage;
