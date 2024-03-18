import React from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';

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

    const { fullName } = data;

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
        <h2 className="vads-u-font-size--h3">
          You've submitted your registration for FMP (VA Form 10-7959f-1)
        </h2>
        <p>We may contact you for more information or documents.</p>
        <div className="inset">
          <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
            Your submission information
          </h3>
          {fullName ? (
            <p>
              <strong>Who submitted this form</strong>
              <br />
              {data.statementOfTruthSignature}
              <br />
            </p>
          ) : null}

          {isValid(submitDate) ? (
            <p>
              <strong>Date submitted</strong>
              <br />
              <span>{format(submitDate, 'MMMM d, yyyy')}</span>
            </p>
          ) : null}
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
        <h2>What happpens now?</h2>
        <p>
          If you're eligible to register for RMP, we'll send you a benefits
          authorization letter. This letter will list your service-connected
          conditions that we'll cover. Then you can file FMP claims for care
          related to the covered conditions.{' '}
        </p>
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
