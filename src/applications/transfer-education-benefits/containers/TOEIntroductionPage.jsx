import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

export const TOEIntroductionPage = ({ user, route }) => {
  return (
    <div className="schemaform-intro">
      <FormTitle title="Apply to use transferred education benefits" />
      <p className="vads-u-font-size--h3">
        Equal to VA Form 22-1990e (Application for Family Member to Use
        Transferred Benefits)
      </p>

      <va-alert close-btn-aria-label="Close notification" status="info" visible>
        <h3 slot="headline">This application is only for some benefit types</h3>
        <div>This application is only for the following education benefit:</div>
        <ul>
          <li>
            Transfer of Entitlement for Post-9/11 GI Bill
            <sup>®</sup> (Chapter 33)
          </li>
        </ul>
      </va-alert>

      <h2 className="vads-u-font-size--h3">
        Follow these steps to get started
      </h2>

      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h3 className="vads-u-font-size--h4">Check your eligibility</h3>
            <p>
              Make sure you meet our eligibility requirements before you apply.
            </p>

            <va-additional-info trigger="What are the Transfer of Entitlement Post-9/11 GI Bill (Chapter 33) eligibility requirements?">
              <p>
                <strong>
                  You must be a spouse or child of a service member to receive
                  transferred entitlement.
                </strong>
              </p>
              <p>
                <strong>
                  If you are a spouse and have received transferred entitlement,
                  you
                </strong>
                :
              </p>
              <ul>
                <li>May use the benefit right away</li>
                <li>
                  May use the benefit while your transferor is on active duty or
                  has separated from service
                </li>
                <li>
                  May use the benefit for up to 15 years after your transferor’s
                  separation from active duty
                </li>
                <li>
                  Don’t qualify for the monthly housing allowance while your
                  transferor is on active duty
                </li>
              </ul>
              <p>
                <strong>
                  If you are a child and have received transferred entitlement,
                  you
                </strong>
                :
              </p>
              <ul>
                <li>
                  May start using the benefit only after your transferor has
                  finished at least 10 years of service
                </li>
                <li>
                  May use the benefit while your transferor is on active duty or
                  has separated from service
                </li>
                <li>
                  Have received a high school diploma (or equivalency
                  certificate), or have reached 18 years of age
                </li>
                <li>Have not yet turned 26 years old</li>
              </ul>
              <p className="vads-u-margin-bottom--0">
                <strong>Note</strong>: The Department of Defense (DoD) decides
                whether your sponsor can transfer GI Bill benefits to you. To
                transfer entitlement, change the number of months transferred,
                or revoke the Transfer of Entitlement, your sponsor must go to
                the DoD milConnect website.
              </p>
            </va-additional-info>

            <p className="vads-u-margin-top--2">
              <strong>Note</strong>: You may be eligible for more than one
              education benefit program. You can only get payments from one
              education benefit program. You can’t get more than 48 months of
              benefits under any combination of VA education programs.
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
            <p>
              <strong>Note</strong>: If you are under 18, your parent or
              guardian must sign the application.
            </p>
          </li>
          <li className="process-step list-three">
            <h5>VA Review</h5>
            <p>
              We process claims within a week. If more than a week has passed
              since you submitted your application and you haven’t heard back,
              please don’t apply again. Call us at.
            </p>
          </li>
          <li className="process-step list-four">
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
        hideUnauthedStartLink
        startText="Start your application"
      />

      <div
        className={`omb-info--container vads-u-padding--0 vads-u-margin-top--${
          user?.login?.currentlyLoggedIn ? '5' : '2p5'
        }`}
      >
        <OMBInfo resBurden="15" ombNumber="2900-0154" expDate="02/28/2023" />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user || {},
});

export default connect(mapStateToProps)(TOEIntroductionPage);

TOEIntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
    }),
    pageList: PropTypes.array,
  }),
  user: PropTypes.object,
};
