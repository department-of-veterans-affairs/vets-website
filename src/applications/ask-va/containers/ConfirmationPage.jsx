import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }

  render() {
    const { form } = this.props;
    const { submission, data } = form;

    const contactOption = data?.contactPreference || 'email';
    const referenceID = submission?.id || 'A-123456-7890';

    return (
      <div>
        <va-alert
          close-btn-aria-label="Close notification"
          className="vads-u-margin-bottom--2"
          status="success"
          visible
          uswds
        >
          <p className="vads-u-margin-y--0">
            Your question was submitted successfully.
          </p>
        </va-alert>
        <p className="vads-u-margin-bottom--3 vads-u-margin-top--3">
          Thank you for submitting a question to the U.S. Department of Veteran
          Affairs. Your reference number is{' '}
          <span className="vads-u-font-weight--bold">{referenceID}</span>
        </p>
        <p className="vads-u-margin-bottom--3">
          You will also receive an email confirmation.
        </p>
        <p className="vads-u-margin-bottom--2">
          You should receive a reply by {contactOption} within 7 business days.
          If we need more information to answer your question, we'll contact
          you.
        </p>
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
