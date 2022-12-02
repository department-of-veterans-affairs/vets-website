import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
// import { format, isValid } from 'date-fns';
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
    const { formId, data } = form;
    const { fullName, vaClaimNumber } = data.veteran;

    const applicants = data.applicants.map((applicant, index) => {
      const { applicantFullName } = applicant.fullName;

      return (
        <div key={index}>
          {applicantFullName.first} {applicantFullName.middle}{' '}
          {applicantFullName.last}
          {applicantFullName.suffix ? `, ${applicantFullName.suffix}` : null}
        </div>
      );
    });

    return (
      <div>
        <div className="print-only">
          <img
            src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
            alt="VA logo"
            width="300"
          />
          <h2 className="vads-u-font-size--h3 vads-u-margin-top--3">
            Application for CHAMPVA Benefits
          </h2>
        </div>
        <h2 className="vads-u-font-size--h3">
          Your application has been submitted
        </h2>
        <p>We may contact you for more information or documents.</p>
        <p className="screen-only">Please print this page for your records.</p>
        <div className="inset">
          <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
            CHAMPVA Benefits Claim{' '}
            <span className="vads-u-font-weight--normal">(Form {formId})</span>
          </h3>
          <ul className="claim-list">
            <li>
              <strong>Sponsored by</strong>
              <br />
              <span>
                {fullName.first} {fullName.middle} {fullName.last}
                {fullName.suffix ? `, ${fullName.suffix}` : null}
              </span>
            </li>
            <li>
              <strong>Applicants</strong>
              <br />
              {applicants}
            </li>
            <li>
              <strong>Date received</strong>
              <br />
              <span>{moment().format('MMM D, YYYY')}</span>
            </li>
            <li>
              <strong>VA file number (claim number)</strong>
              <br />
              <span>{vaClaimNumber}</span>
            </li>
          </ul>
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
