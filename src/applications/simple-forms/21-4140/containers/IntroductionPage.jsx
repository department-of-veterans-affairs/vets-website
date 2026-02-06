import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { scrollToTop } from 'platform/utilities/ui';
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
      <p className="va-introtext">
        Use this form if we asked you to verify your income and employment
        status for your Individual Unemployment (IU) benefits.
      </p>

      <h2>What to know before you fill out this form</h2>
      <ul>
        <li>
          You need to complete this form within <strong>65 days</strong> of the
          notice you received
        </li>
        <li>
          You’ll need to provide information about any employers and employment
          you’ve had in the past 12 months
        </li>
        <li>You’ll need your Social Security number or your VA file number</li>
        <li>
          After you submit this form, we’ll review it and advise you of our
          decision and your options
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
          hideUnauthedStartLink
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
