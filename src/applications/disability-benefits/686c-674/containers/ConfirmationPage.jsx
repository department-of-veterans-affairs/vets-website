import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('#thank-you-message');
    scrollToTop('topScrollElement');
  }

  handlePrintClick = () => {
    window.print();
  };

  render() {
    const { submission, data } = this.props.form;
    const { response } = submission;
    const veteranFirstName = data?.veteranInformation?.fullName?.first || '';
    const veteranLastName = data?.veteranInformation?.fullName?.last || '';
    const dateSubmitted = moment(response?.timestamp);

    return (
      <>
        <div className="print-only">
          <img
            src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
            alt="VA logo"
            width="300"
          />
          <h2 className="vads-u-margin-top--2">
            Add or remove a dependent on your VA disability benefits
          </h2>
          <div className="vads-u-margin-bottom--2">
            VA Form 21-686c (with 21P-527EZ and 21-674)
          </div>
        </div>
        <div className="inset">
          <h2
            id="thank-you-message"
            className="vads-u-font-size--h2 vads-u-font-family--serif vads-u-margin-top--1"
          >
            Thank you for submitting your application
          </h2>
          <dl>
            <dt>
              <strong>
                Application for Declaration of Status of Dependents (Form
                21-686c), and/or
                <br />
                Request for Approval of School Attendance (Form 21-674), and/or
                <br />
                Application for Veterans Pension (Form 21P-527EZ)
              </strong>
            </dt>
            <dd>
              {veteranFirstName || veteranLastName
                ? `for ${veteranFirstName} ${veteranLastName}`
                : ''}
            </dd>
            <dt>
              <strong>Date submitted</strong>
            </dt>
            <dd>
              {dateSubmitted.isValid()
                ? dateSubmitted.format('MMMM D, YYYY')
                : ''}
            </dd>
          </dl>
          <button
            type="button"
            className="usa-button screen-only"
            onClick={this.handlePrintClick}
          >
            Print this page for your records
          </button>
        </div>
        <div>
          <h2 className="vads-u-font-size--h2 vads-u-font-family--serif">
            What to expect next
          </h2>

          <p>
            You don't need to do anything unless we send you a letter asking for
            more information. Once we process your claim, we'll mail you a
            letter with our decision.
          </p>
          <p>You can also check the status of your claim online.</p>
          <a
            href="/claim-or-appeal-status/"
            rel="noopener noreferrer"
            target="_blank"
            aria-label="Check the status of your claim online"
            className="vads-c-action-link--green vads-u-margin-bottom--4"
          >
            Check the status of your claim online
          </a>
          <p>
            <strong>Note: </strong> It may take 7 to 10 days after you apply for
            your claim to appear online.
          </p>
          {/*
          <p>
            If we haven’t contacted you within a week after you submitted your
            application, <strong>don’t apply again</strong>. Instead, call our
            toll-free hotline at{' '}
            <va-telephone contact="8772228387" vanity="VETS" />. We’re here
            Monday through Friday, 8:00 am to 8:00 pm ET
          </p> */}

          <h2 className="vads-u-font-size--h2 vads-u-font-family--serif">
            What if I have additional evidence I need to submit?
          </h2>

          <p>You have two options for submitting additional evidence:</p>

          <h3>Submit your files online through AccessVA</h3>

          <va-link
            href="https://eauth.va.gov/accessva/?cspSelectFor=quicksubmit"
            text="Go to AccessVA to use QuickSubmit (opens in a new tab)"
          />

          <h3>Option 2: Mail us copies of your documents</h3>

          <div>
            <p>You can mail copies of your files to us at this address:</p>
            <p className="va-address-block">
              U.S. Department of Veterans Affairs
              <br />
              Evidence Intake Center
              <br />
              P.O. Box 4444
              <br />
              Janesville, WI 53547-4444
            </p>
            <p>
              <strong>Note:</strong> Don't send us your original documents. We
              can't return them. Send us copies of your documents only.
            </p>
          </div>

          <h2 className="vads-u-font-size--h2 vads-u-font-family--serif">
            What if I need to add or remove another dependent later?
          </h2>

          <p>
            If you need to add or remove another dependent, complete and submit
            another dependency claim.
          </p>

          <h2 className="vads-u-font-size--h2 vads-u-font-family--serif">
            How to contact us if you have questions
          </h2>

          <p>You can ask us a question online through Ask VA.</p>
          <a href="https://ask.va.gov/">Contact us through Ask VA</a>
          <p className="vads-u-margin-bottom--6">
            Or call us at <va-telephone contact={CONTACTS.VA_BENEFITS} />
            (TTY: <va-telephone contact={CONTACTS[711]} />) We’re here Monday
            through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
          <p>
            <strong> If you don't hear back from us about your claim,</strong>{' '}
            don't file another claim. Contact us online or call us instead.
          </p>
          <div className="row form-progress-buttons schemaform-back-buttons">
            <div className="small-6 usa-width-one-half medium-6 columns">
              <a href="/" className="vads-c-action-link--blue">
                Go back to VA.gov
              </a>
            </div>
          </div>
          <div className="confirmation-guidance-container">
            <h3 className="confirmation-guidance-heading">Need help?</h3>
            <p className="confirmation-guidance-message">
              For help filling out this form, or if the form isn't working
              right, please call VA Benefits and Services at{' '}
              <va-telephone contact={CONTACTS.VA_BENEFITS} /> (TTY:{' '}
              <va-telephone contact={CONTACTS[711]} />)
            </p>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      veteranInformation: PropTypes.shape({
        fullName: PropTypes.shape({
          first: PropTypes.string,
          last: PropTypes.string,
        }),
      }),
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      response: {
        timestamp: PropTypes.string,
      },
    }),
  }),
};

export default connect(mapStateToProps)(ConfirmationPage);
