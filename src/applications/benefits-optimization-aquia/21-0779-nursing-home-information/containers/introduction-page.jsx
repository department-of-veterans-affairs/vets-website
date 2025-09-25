import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { useSelector } from 'react-redux';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { TITLE, SUBTITLE } from '../constants';

const OMB_RES_BURDEN = 15;
const OMB_NUMBER = '2900-0361';
const OMB_EXP_DATE = '07/31/2024';

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Prepare">
        <h4>To fill out this application, you’ll need:</h4>
        <ul>
          <li>Your Social Security number</li>
          <li>Nursing home name and address</li>
          <li>Date of admission to nursing home</li>
          <li>Information about nursing home costs and payment sources</li>
          <li>Medicaid information (if applicable)</li>
        </ul>
        <p>
          <strong>What if I need help filling out my application?</strong> An
          accredited representative, like a Veterans Service Officer (VSO), can
          help you fill out your claim.{' '}
          <a href="/disability-benefits/apply/help/index.html">
            Get help filing your claim
          </a>
        </p>
      </va-process-list-item>
      <va-process-list-item header="Apply">
        <p>Complete this nursing home information form.</p>
        <p>
          This form helps us determine your eligibility for aid and attendance
          benefits while you’re in a nursing home.
        </p>
        <p>
          After submitting the form, you’ll get a confirmation message. You can
          print this for your records.
        </p>
      </va-process-list-item>
      <va-process-list-item header="VA Review">
        <p>
          We’ll review your nursing home information to determine your
          eligibility for additional benefits. Processing typically takes 2-4
          weeks.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Decision">
        <p>
          Once we’ve reviewed your nursing home information, you’ll receive a
          decision letter in the mail regarding your aid and attendance
          benefits.
        </p>
      </va-process-list-item>
    </va-process-list>
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
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow the steps below to apply for nursing home aid and attendance
        benefits.
      </h2>
      <ProcessList />
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
