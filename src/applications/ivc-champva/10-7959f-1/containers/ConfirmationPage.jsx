import React from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';

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
        <VaAlert uswds status="success">
          <h2 className="vads-u-font-size--h3">You've submitted your form</h2>
        </VaAlert>

        <div className="inset">
          <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
            Your submission information
          </h3>
          {data.statementOfTruthSignature && (
            <p>
              <strong>This form was submitted for</strong>
              <br />
              {data.statementOfTruthSignature}
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
            type="button"
            text="Print this page"
            className="usa-button screen-only"
            onClick={window.print}
          />
        </div>
        <h2>What to expect after you submit your form</h2>
        <p>
          We'll review your registration form, which can take up to 60 days. If
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
            the FMP office at <va-telephone contact="8773458179" />. We're here
            Monday through Friday, 8:05 a.m. to 6:45 p.m. ET.
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
