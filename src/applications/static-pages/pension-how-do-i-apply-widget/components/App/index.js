import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VA_FORM_IDS } from 'platform/forms/constants';
import ApplicationStatus from 'platform/forms/save-in-progress/ApplicationStatus';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

export const App = ({ loggedIn }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const pensionFormEnabled = useToggleValue(TOGGLE_NAMES.pensionFormEnabled);
  return pensionFormEnabled ? (
    <ApplicationStatus
      formId={VA_FORM_IDS.FORM_21P_527EZ}
      showApplyButton
      showLearnMoreLink
      additionalText="You can apply online right now."
      applyHeading="How do I apply?"
      applyLink="/pension/how-to-apply/"
      applyText="Apply for Veterans Pension benefits"
    />
  ) : (
    <va-alert
      close-btn-aria-label="Close notification"
      status="info"
      visible
      aria-labelledby="alert-heading"
      aria-describedby="alert-description"
    >
      <h3 id="alert-heading" slot="headline">
        The PDF form is the only computer option for applying right now
      </h3>
      <div id="alert-description">
        {loggedIn ? (
          <>
            <p>
              We’re updating our online form. Our new online form will be
              available in January 2024. If you already started applying online,
              you can continue your application then. We’ll transfer your saved
              information to the new form.
            </p>
            <p>
              Or, you can apply now using a PDF form. You can sign in to VA.gov
              to refer to your saved information to fill out the PDF form.
            </p>
            <va-link
              download
              filetype="PDF"
              href="https://www.vba.va.gov/pubs/forms/VBA-21P-527EZ-ARE.pdf"
              pages={8}
              text="Download VA form 21P-527EZ"
            />
            <p>
              You can refer to your saved information to fill out the PDF form.
            </p>
            <va-link
              href="/pension/application/527EZ/introduction"
              text="Refer to your saved form"
            />
            <p>
              <strong>Note: </strong>
              We’ll record the potential start date for your benefits as the
              date you first saved your online form. You have 1 year from this
              date to submit your application.
            </p>
          </>
        ) : (
          <>
            <p>
              We’re updating our online application. While we’re updating on
              online application, your options are:
              <ul>
                <li>
                  <strong>You can apply now using a PDF form.</strong> We
                  provide a link on this page so you can download the PDF form.
                  If you already started applying online, you can still refer to
                  your saved information when you fill out the PDF form. Keep
                  reading on this page for instructions.
                </li>
                <li>
                  <strong>
                    You can wait until January 2024 and apply online then.
                  </strong>{' '}
                  If you already started applying online, we’ll transfer your
                  saved information to the new online application.
                </li>
              </ul>
            </p>
            <p>
              <strong>Note: </strong>
              We’ll record the potential start date for your benefits as the
              date you first saved your online form. You have 1 year from this
              date to apply.
            </p>
          </>
        )}
      </div>
    </va-alert>
  );
};

App.propTypes = {
  loggedIn: PropTypes.bool,
};

export const mapStateToProps = state => ({
  loggedIn: state?.user?.login?.currentlyLoggedIn,
});

export default connect(mapStateToProps)(App);
