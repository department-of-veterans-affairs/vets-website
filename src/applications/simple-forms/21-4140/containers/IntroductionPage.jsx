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

const FormDescription = () => {
  return (
    <div>
      <p>
        You may need to complete the Income Verification for Disability Benefits
        form if you receive Individual Unemployability (IU) benefits. These
        benefits cover service-connected disabilities that prevent you from
        working. The VA checks IU recipients every year. They match wage data
        with the Social Security Administration (SSA). This ensures you still
        qualify for benefits. If the match shows you earned income above the
        poverty line while receiving IU benefits, the VA will ask you to
        complete this form. Be sure to complete and return this form within 65
        days of the notice. If you don’t respond, you may lose your IU benefits.
      </p>
      <h2>What to know before you fill out this form</h2>
      <p>
        You’ll need your Social Security number or your VA file number. If you
        were employed, you will need to provide information about your employer
        and employment. After you submit this form, we will review and advise
        you of the decision and your options.
      </p>
    </div>
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
      <FormDescription />
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
