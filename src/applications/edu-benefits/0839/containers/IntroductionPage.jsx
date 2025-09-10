import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { focusElement, scrollToTop } from 'platform/utilities/ui';
import { querySelectorWithShadowRoot } from 'platform/utilities/ui/webComponents';
import { toggleLoginModal as toggleLoginModalAction } from '~/platform/site-wide/user-nav/actions';
import { isLoggedIn } from 'platform/user/selectors';
// import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { useSelector, useDispatch } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { TITLE, SUBTITLE } from '../constants';
import OmbInfo from '../components/OmbInfo';

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Complete the form">
        <p>
          Start by completing VA Form 22-0839 online. You’ll begin by selecting
          the type of agreement your school wants to submit:
        </p>
        <ul>
          <li>A new open-ended agreement</li>
          <li>A request to modify an existing agreement</li>
          <li>A request to withdraw from the Yellow Ribbon Program</li>
        </ul>
        <p>
          Next, provide details about your school’s Yellow Ribbon Program
          contributions.
        </p>
        <ul>
          <li>
            U.S. schools must include the maximum number of students, degree
            level, college or professional school, and maximum contribution
            amount per student.
          </li>
          <li>
            Foreign schools must include the maximum number of students, degree
            level, the currency type used for billing, and maximum contribution
            amount per student.
          </li>
        </ul>
        <p>
          At the end, the authorized official will review and acknowledge the
          terms of participation.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Submit the form">
        <p>
          After you complete the form, it will be automatically sent to VA for
          processing.
        </p>
      </va-process-list-item>
    </va-process-list>
  );
};

const PrivacyActAccordion = () => {
  return (
    <div className="vads-u-margin-top--1">
      <va-accordion bordered open-single>
        <va-accordion-item header="View Privacy Act Statement">
          <p>
            VA will not disclose information collected on this form to any
            sources other than what has been authorized under the Privacy Act of
            1974 or Title 38, Code of Federal Regulations, Section 1.526 for
            routine uses e.g. VA sends education forms or letters with a
            Veteran’s identifying information to the Veteran’s school or
            training establishment to (1) assist the Veteran in the completion
            of claims forms or (2) for the VA to obtain further information as
            may be necessary from the school for the VA to properly process the
            Veteran’s education claim or to monitor his or her progress during
            training as identified in the VA System of Records, 58VA21/22/28,
            Compensation, Pension, Education and Veteran Readiness and
            Employment Records - VA, published in the Federal Register.
          </p>
        </va-accordion-item>
        <va-accordion-item header="View Respondent Burden">
          <p>
            An agency may not conduct or sponsor, and a person is not required
            to respond to, a collection of information unless it displays a
            currently valid OMB control number. The OMB control number for this
            project is 2900-0718, and it expires 01/31/2028. Public reporting
            burden for this collection of information is estimated to average 14
            hours per respondent, per year, including the time for reviewing
            instructions, searching existing data sources, gathering and
            maintaining the data needed, and completing and reviewing the
            collection of information. Send comments regarding this burden
            estimate and any other aspect of this collection of information,
            including suggestions for reducing the burden, to VA Reports
            Clearance Officer at{' '}
            <a href="mailto:vapra@va.gov" target="_blank" rel="noreferrer">
              vapra@va.gov
            </a>
            . Please refer to OMB Control No. 2900-0718 in any correspondence.
            Do not send your completed VA Form 22-0839 to this email address.
          </p>
        </va-accordion-item>
      </va-accordion>
    </div>
  );
};

export const IntroductionPage = props => {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  // const userLoggedIn = true;
  const dispatch = useDispatch();
  const toggleLoginModal = useCallback(
    (showModal, source, showSignInModal) => {
      dispatch(toggleLoginModalAction(showModal, source, showSignInModal));
    },
    [dispatch],
  );
  // const userIdVerified = useSelector(state => isLOA3(state)); // applicable for our form?
  const { route } = props;
  const { formConfig, pageList } = route;
  // const showVerifyIdentify = userLoggedIn && !userIdVerified;

  const removePrivacyActButton = async () => {
    const vaOmbInfo = document.querySelector('va-omb-info');
    if (vaOmbInfo) {
      const privacyActButton = await querySelectorWithShadowRoot(
        'va-button[secondary]',
        vaOmbInfo,
      );
      if (privacyActButton) {
        privacyActButton.setAttribute('style', 'display:none;');
      }
    }
  };

  useEffect(() => {
    scrollToTop();
    focusElement('h1');

    // Remove the Privacy Act Statement button from va-omb-info component
    const removeButton = async () => {
      await removePrivacyActButton();
    };

    removeButton();
  }, []);

  const showSignInModal = useCallback(
    () => {
      toggleLoginModal(true, 'ask-va', true);
    },
    [toggleLoginModal],
  );
  function SignInButton() {
    return (
      <span slot="SignInButton">
        <VaButton
          text="Sign in or create an account"
          onClick={showSignInModal}
        />
      </span>
    );
  }
  useEffect(
    () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('showSignInModal') === 'true' && !userLoggedIn) {
        showSignInModal();
      }
    },
    [userLoggedIn, toggleLoginModal, showSignInModal],
  );

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <va-banner
        data-label="Info banner"
        type="info"
        headline="For educational institutions only"
        visible
      >
        <p className="vads-u-margin-y--0">
          <strong>Note:</strong> This form is intended for educational
          institutions and training facilities submitting reports regarding
          school certifying officials.
        </p>
      </va-banner>

      <h2 className=" vads-u-margin-top--4">
        What to know before you fill out this form
      </h2>
      <ul>
        <li>
          If your school doesn’t want to participate in the Yellow Ribbon
          Program, you don’t need to submit this form.
        </li>
        <li>
          Schools must submit a new agreement each academic year to stay in the
          program, even if nothing is changing.
        </li>
        <li>
          U.S. schools can submit this form from March 15 through May 15 (or the
          following Monday if May 15 falls on a weekend).
        </li>
        <li>
          Foreign schools can submit this form from June 1 through July 31 (or
          the following Monday if July 31 falls on a weekend).
        </li>
      </ul>
      <p>
        <va-link
          external
          text="Review additional instructions for the Yellow Ribbon Program Agreement"
          href="/school-administrators/submit-yellow-ribbon-program-agreement-form-22-0839/yellow-ribbon-instructions"
        />
      </p>
      <va-summary-box>
        <h3 slot="headline">Submission guidelines</h3>
        <ul>
          <li>
            This form must be completed and signed by a school official who is
            authorized to enter into financial agreements on behalf of the
            school. This applies to both U.S. and foreign schools.
          </li>
          <li>
            The authorized official will be required to review and acknowledge a
            series of statements confirming that the school understands and
            agrees to the terms of participating in the Yellow Ribbon Program.
            These include statements about funding, reporting requirements, and
            maintaining records.
          </li>
        </ul>
      </va-summary-box>
      <h2 className="vads-u-margin-top--4">
        How do I submit my Yellow Ribbon Agreement?
      </h2>
      <ProcessList />
      <div className="vads-u-border-top--4 vads-u-margin-bottom--4">
        {!userLoggedIn ? (
          // <div>{/* add verify identity alert if applicable */}</div> -- when is this applicable?

          <div className="not-logged-in">
            <va-alert-sign-in
              data-testid="sign-in-alert"
              disable-analytics
              heading-level={3}
              no-sign-in-link={null}
              time-limit={null}
              variant="signInRequired"
              visible
            >
              <span slot="SignInButton">
                <SignInButton />
              </span>
            </va-alert-sign-in>
          </div>
        ) : (
          <>
            <h2 className="vads-u-margin-top--1p5">Start the form</h2>
            <SaveInProgressIntro // render differently if user is logged in?
              headingLevel={2}
              prefillEnabled={formConfig.prefillEnabled}
              messages={formConfig.savedFormMessages}
              pageList={pageList}
              startText="Start your Yellow Ribbon Agreement"
              formConfig={formConfig}
              devOnly={{
                forceShowFormControls: true,
              }}
              unauthStartText="Sign in to start your form"
            />

            {/* <va-banner data-label="Info banner" type="info" visible>
            <p>
              You can save this form in progress, and come back later to finish
              filling it out.
            </p>
          </va-banner> */}

            {/* Start form action link -- possible to conditionally render via SaveInProgressIntro ?? */}
          </>
        )}
      </div>
      <OmbInfo />
      <PrivacyActAccordion />
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
