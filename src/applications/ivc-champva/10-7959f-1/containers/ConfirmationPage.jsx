import React from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';
import { scrollToTop } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import { privWrapper } from '../../shared/utilities';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }

  render() {
    const { form } = this.props;
    const { submission, data } = form;

    const submitDate = new Date(submission?.timestamp);

    return (
      <div>
        <div className="print-only">
          <img
            src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
            alt="VA logo"
            width="300"
          />
          <h2>
            Register for the Foreign Medical Program (FMP) with Form 10-7959f-1
          </h2>
        </div>

        <div className="success-message vads-u-margin-bottom--4">
          <va-alert status="success">
            <h2 slot="headline" className="vads-u-font-size--h3">
              You’ve submitted your registration for FMP
            </h2>
          </va-alert>
        </div>

        <div className="inset">
          <h2 className="vads-u-margin-top--0 vads-u-font-size--h3">
            Your submission information
          </h2>
          {data.statementOfTruthSignature && (
            <p>
              <strong>Who submitted this form</strong>
              <br />
              {privWrapper(data.statementOfTruthSignature)}
              <br />
            </p>
          )}
          {isValid(submitDate) && (
            <p>
              <strong>Date submitted</strong>
              <br />
              <span>{format(submitDate, 'MMMM d, yyyy')}</span>
            </p>
          )}
          <p className="screen-only">
            You can print this confirmation page for your records.
          </p>

          <va-button
            className="usa-button screen-only"
            onClick={window.print}
            text="Print this page"
          />
        </div>
        <h2>What to expect next</h2>
        <p>
          We'll review your registration form. This can take up to 90 days. If
          you're eligible for this program, we'll send you a benefits
          authorization letter. This letter will list your service-connected
          conditions that we'll cover.
        </p>
        <p>
          If you already received care and need to file an FMP claim, you can
          file it now. You don't need to wait for your authorization letter.
        </p>
        <a href="https://www.va.gov/resources/how-to-file-a-va-foreign-medical-program-claim/">
          Learn how to file an FMP claim
        </a>
        <div>
          <p>
            If you have questions about your registration or an FMP claim, call
            the FMP office at <va-telephone contact="8339300816" /> (
            <va-telephone tty contact="711" />
            ). We're here Monday through Friday, 8:05 a.m. to 6:45 p.m. ET.
          </p>
          <p>You can also contact us online through our Ask VA tool.</p>
          <a href="https://ask.va.gov/">Go to Ask VA</a>
          <br />
          <br />
          <a className="vads-c-action-link--green" href="https://www.va.gov/">
            Go back to VA.gov
          </a>
        </div>
      </div>
    );
  }
}

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      statementOfTruthSignature: PropTypes.string,
      fullName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    response: PropTypes.shape({ confirmationNumber: PropTypes.string }),
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
