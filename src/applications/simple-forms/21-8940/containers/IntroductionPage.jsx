import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { useSelector } from 'react-redux';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { TITLE, SUBTITLE } from '../constants';

const OMB_RES_BURDEN = 45;
const OMB_NUMBER = '2900-0404';
const OMB_EXP_DATE = '07/31/2027';

const WhatToKnowSection = () => {
  return (
    <div className="vads-u-margin-bottom--4">
      <h3>What to know before you fill out this form</h3>
      <ul>
        <li>
          This form is for Veterans who can’t keep a steady job that supports
          them financially (known as substantially gainful employment) because
          of their service-connected disability.
        </li>
        <li>
          When you complete this form, you’re claiming total disability because
          of a service-connected disability. And you’re claiming that your
          service-connected disability prevents you from keeping substantially
          gainful employment.
        </li>
      </ul>
    </div>
  );
};

const InformationNeededSection = () => {
  return (
    <div className="vads-u-margin-bottom--4">
      <h3>Information you’ll need to fill out this form</h3>
      <ul>
        <li>
          Names, addresses, and dates of care for doctor and hospital visits
          over the past 12 months
        </li>
        <li>
          Information about employers and employment you’ve had over the past 5
          years
        </li>
        <li>
          Contact information and application dates for any jobs you’ve applied
          to over the past 12 months
        </li>
        <li>Your Social Security number or your VA file number</li>
      </ul>
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
      <p>
        Use this form if you want to apply for Individual Unemployability
        disability benefits for a service-connected condition that prevents you
        from keeping a steady job.
      </p>
      <WhatToKnowSection />
      <InformationNeededSection />
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
