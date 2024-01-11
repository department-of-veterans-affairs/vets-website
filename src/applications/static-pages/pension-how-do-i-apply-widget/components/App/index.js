import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';
import { VA_FORM_IDS } from 'platform/forms/constants';
import ApplicationStatus from 'platform/forms/save-in-progress/ApplicationStatus';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

export const App = ({ loggedIn, toggleLoginModal }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const pensionFormEnabled = useToggleValue(TOGGLE_NAMES.pensionFormEnabled);
  return pensionFormEnabled ? (
    <>
      <ApplicationStatus
        formId={VA_FORM_IDS.FORM_21P_527EZ}
        showApplyButton
        showLearnMoreLink
        additionalText="You can apply online right now."
        applyHeading="How do I apply?"
        applyLink="/pension/how-to-apply/"
        applyText="Apply for Veterans Pension benefits"
      />
      <h3>You can also apply:</h3>
      <h4>By mail TESTING</h4>
      <p>Fill out an application for Pension (VA Form 21P-527EZ).</p>
      <va-link
        text="Get VA Form 21P-527EZ to download"
        filetype="PDF"
        href="https://www.vba.va.gov/pubs/forms/VBA-21P-527EZ-ARE.pdf"
        pages={8}
      />
      <br />
      <p>Mail the completed form to the pension management center (PMC):</p>
      <p className="va-address-block">
        Department of Veterans Affairs <br />
        Pension Intake Center
        <br />
        PO Box 5365
        <br />
        Janesville, WI 53547-5365
        <br />
      </p>
      <h4>In person</h4>
      <p>Bring your application to a VA regional office near you.</p>
      <va-link
        text="Find your nearest VA regional office"
        href="/find-locations/?facilityType=benefits"
      />
      <h4>With the help of a trained professional</h4>
      <p>
        You can work with a trained professional called an accredited
        representative to get help applying for VA pension benefits.
      </p>
      <va-link
        text="Get help filing your claim"
        href="/disability/get-help-filing-claim/"
      />
      <br />
      <br />
      <va-link
        text="Find out how to apply for a Survivors Pension"
        href="/pension/survivors-pension/"
      />
    </>
  ) : (
    <>
      {loggedIn ? (
        <div>
          <va-alert
            close-btn-aria-label="Close notification"
            status="info"
            visible
            aria-labelledby="alert-heading"
            aria-describedby="alert-description"
          >
            <h3 id="alert-heading" slot="headline">
              You can’t use our online application right now
            </h3>
            <div id="alert-description">
              <p>
                We’re updating our online application. While we’re working on
                the application, you have these options:
              </p>
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
              <p>
                <strong>If you’re not ready to apply yet,</strong> you can
                submit an intent to file form. This sets a potential start date
                for your benefits. If you notify us of your intent to file, you
                may be able to get back payments for the time between when you
                submit your intent to file form and when we approve your claim.
              </p>
              <va-link
                text="Find out how to submit an intent to file form"
                href="https://www.va.gov/pension/how-to-apply/#should-i-submit-an-intent-to-f"
              />
            </div>
          </va-alert>
          <h3>You can apply in any of these 4 ways</h3>
          <p>First, fill out an Application for Pension (VA Form 21P-527EZ).</p>
          <va-link
            text="Get
          VA Form 21P-527EZ to download"
            href="https://www.vba.va.gov/pubs/forms/VBA-21P-527EZ-ARE.pdf"
          />
          <p>
            If you started applying online already, you can still sign in to
            VA.gov to refer to your saved information when you fill out the PDF
            form.
          </p>
          <va-link
            href="/pension/application/527EZ/introduction"
            text="Refer to your saved form"
          />
          <p>Then submit your completed form in 1 of these ways:</p>
          <h4>Upload your form online</h4>
          <p>
            Upload a copy of your completed form using the QuickSubmit tool
            through AccessVA. If it’s your first time signing in to this tool,
            you’ll need to register first. After you’ve registered, you can
            upload your application and documents online.
          </p>
          <va-link
            text="Upload your form through AccessVA"
            href="https://eauth.va.gov/accessva/?cspSelectFor=quicksubmit"
          />
          <h4>Mail your form</h4>
          <p>
            Mail your completed form to the pension management center (PMC):
          </p>
          <p className="va-address-block">
            Department of Veterans Affairs <br />
            Pension Intake Center
            <br />
            PO Box 5365
            <br />
            Janesville, WI 53547-5365
            <br />
          </p>
          <h4>Submit your form in person</h4>
          <p>Bring your completed form to a VA regional office near you.</p>
          <va-link
            text="Find your nearest VA regional office"
            href="href=/find-locations/?facilityType=benefits"
          />
          <h4>Apply with the help of a trained professional</h4>
          <p>
            You can work with a trained professional called an accredited
            representative to get help applying for VA pension benefits.
          </p>
          <va-link
            text="Get help filing your claim"
            href="/disability/get-help-filing-claim/"
          />
        </div>
      ) : (
        <div>
          <va-alert
            close-btn-aria-label="Close notification"
            status="info"
            visible
            aria-labelledby="alert-heading"
            aria-describedby="alert-description"
          >
            <h3 id="alert-heading" slot="headline">
              You can’t use our online application right now
            </h3>
            <div id="alert-description">
              <p>
                We’re updating our online application. While we’re working on
                the application, you have these options:
              </p>
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
              <p>
                <strong>If you’re not ready to apply yet,</strong> you can
                submit an intent to file form. This sets a potential start date
                for your benefits. If you notify us of your intent to file, you
                may be able to get back payments for the time between when you
                submit your intent to file form and when we approve your claim.
              </p>
              <va-link
                text="Find out how to submit an intent to file form"
                href="/pension/how-to-apply/#should-i-submit-an-intent-to-f"
              />
            </div>
          </va-alert>
          <h3>You can apply in any of these 4 ways</h3>
          <p>First, fill out an Application for Pension (VA Form 21P-527EZ).</p>
          <va-link
            text="Get
            VA Form 21P-527EZ to download"
            href="https://www.vba.va.gov/pubs/forms/VBA-21P-527EZ-ARE.pdf"
          />
          <p>
            If you started applying online already, you can still sign in to
            VA.gov to refer to your saved information when you fill out the PDF
            form.
          </p>
          <va-button
            onClick={() => {
              toggleLoginModal(true);
            }}
            text="Sign in to VA.gov"
          />
          <p>Then submit your completed form in 1 of these ways:</p>
          <h4>Upload your form online</h4>
          <p>
            Upload a copy of your completed form using the QuickSubmit tool
            through AccessVA. If it’s your first time signing in to this tool,
            you’ll need to register first. After you’ve registered, you can
            upload your application and documents online.
          </p>
          <va-link
            text="Upload your form through AccessVA"
            href="https://eauth.va.gov/accessva/?cspSelectFor=quicksubmit"
          />
          <h4>Mail your form</h4>
          <p>
            Mail your completed form to the pension management center (PMC):
          </p>
          <p className="va-address-block">
            Department of Veterans Affairs <br />
            Pension Intake Center
            <br />
            PO Box 5365
            <br />
            Janesville, WI 53547-5365
            <br />
          </p>
          <h4>Submit your form in person</h4>
          <p>Bring your completed form to a VA regional office near you.</p>
          <va-link
            text="Find your nearest VA regional office"
            href="href=/find-locations/?facilityType=benefits"
          />
          <h4>Apply with the help of a trained professional</h4>
          <p>
            You can work with a trained professional called an accredited
            representative to get help applying for VA pension benefits.
          </p>
          <va-link
            text="Get help filing your claim"
            href="/disability/get-help-filing-claim/"
          />
        </div>
      )}
    </>
  );
};

App.propTypes = {
  toggleLoginModal: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool,
};

export const mapStateToProps = state => ({
  loggedIn: state?.user?.login?.currentlyLoggedIn,
});

export const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
