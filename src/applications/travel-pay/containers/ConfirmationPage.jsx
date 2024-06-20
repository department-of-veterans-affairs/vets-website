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
    const { submission, formId, data } = form;
    const submitDate = submission ? submission.timestamp : null;
    const { fullName } = data;

    return (
      <div>
        <div className="print-only">
          <img
            src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
            alt="VA logo"
            width="300"
          />
          <h2>Application for Mock Form</h2>
        </div>
        <h2 className="vads-u-font-size--h3">
          Your application has been submitted
        </h2>
        <p>We may contact you for more information or documents.</p>
        <p className="screen-only">Please print this page for your records.</p>
        <div className="inset">
          <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
            Beneficiary Travel Claim{' '}
            <span className="vads-u-font-weight--normal">(Form {formId})</span>
          </h3>
          {fullName ? (
            <span>
              for {fullName.first} {fullName.middle} {fullName.last}
              {fullName.suffix ? `, ${fullName.suffix}` : null}
            </span>
          ) : null}

          {isValid(submitDate) ? (
            <p>
              <strong>Date submitted</strong>
              <br />
              <span>{format(submitDate, 'MMMM d, yyyy')}</span>
            </p>
          ) : null}
          <button
            type="button"
            className="usa-button screen-only"
            onClick={window.print}
          >
            Print this for your records
          </button>
        </div>
      </div>
    );
  }
}

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
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
