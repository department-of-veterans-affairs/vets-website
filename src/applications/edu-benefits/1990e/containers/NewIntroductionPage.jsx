import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

export const NewIntroductionPage = ({ user, route }) => {
  return (
    <div className="schemaform-intro">
      <FormTitle title="Apply to use transferred education benefits" />
      <p className="vads-u-font-size--h3">
        Equal to VA Form 22-1990e (Application for Family Member to Use
        Transferred Benefits)
      </p>

      <va-alert close-btn-aria-label="Close notification" status="info" visible>
        <h3 slot="headline">
          This application is only for Transfer of Entitlement for Post-9/11 GI
          Bill®
        </h3>
        <p className="vads-u-margin-bottom--0">
          <a href="https://www.va.gov/education/transfer-post-9-11-gi-bill-benefits/">
            Learn more about the Transfer of Entitlement for Post-9/11 GI Bill®
            (Chapter 33).
          </a>
        </p>
      </va-alert>

      <h2 className="vads-u-font-size--h3">
        Follow these steps to get started
      </h2>

      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h3 className="vads-u-font-size--h4">Check your eligibility</h3>
            <p>
              In order to receive this benefit, you must be a spouse or child of
              a sponsor who has transferred a benefit to you.
            </p>
            <p>
              If this isn’t the right benefit for you,{' '}
              <a href="https://www.va.gov/education/eligibility/">
                learn more about other education benefits
              </a>
              .
            </p>
          </li>
          <li className="process-step list-two">
            <h3 className="vads-u-font-size--h4">Gather your information</h3>
            <p>
              <strong>Here’s what you’ll need to apply</strong>:
            </p>
            <ul>
              <li>Knowledge of your sponsor’s military service history</li>
              <li>Your current address and contact information</li>
              <li>Bank account direct deposit information</li>
            </ul>
            <p className="vads-u-margin-bottom--0">
              <strong>Note</strong>: If you are under 18, your parent or
              guardian must sign the application.
            </p>
          </li>
          <li className="process-step list-three">
            <h3 className="vads-u-font-size--h4">Start your application</h3>
            <p>
              We’ll take you through each step of the process. It should take
              about 15 minutes.
            </p>

            <va-additional-info trigger="What happens after I apply?">
              <p>
                After you apply, you may get an automatic decision. If we
                approve or deny your application, you’ll be able to download
                your decision letter right away. We’ll also mail you a copy of
                your decision letter.
              </p>
              <p className="vads-u-margin-bottom--0">
                <strong>Note</strong>: In some cases, we may need more time to
                make a decision. If you don’t get an automatic decision right
                after you apply, you’ll receive a decision letter in the mail in
                about 30 days. And we’ll contact you if we need more
                information.
              </p>
            </va-additional-info>
          </li>
        </ol>
      </div>

      {user?.login?.currentlyLoggedIn && (
        <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
          Begin your application for education benefits
        </h2>
      )}

      <SaveInProgressIntro
        testActionLink
        user={user}
        prefillEnabled={route.formConfig.prefillEnabled}
        messages={route.formConfig.savedFormMessages}
        pageList={route.pageList}
        startText="Start your application"
      />

      <div
        className={`omb-info--container vads-u-padding--0 vads-u-margin-top--${
          user?.login?.currentlyLoggedIn ? '4' : '2p5'
        } vads-u-margin-bottom--2`}
      >
        <OMBInfo resBurden="15" ombNumber="2900-0154" expDate="02/28/2023" />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user || {},
});

export default connect(mapStateToProps)(NewIntroductionPage);

NewIntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
    }),
    pageList: PropTypes.array,
  }),
  user: PropTypes.object,
};
