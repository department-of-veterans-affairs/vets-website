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
    // const { form } = this.props;
    // const { submission, formId, data } = form;
    // const { fullName } = data;
    // TODO: use backend data instead of placeholders
    const fullName = {
      first: 'John',
      middle: '',
      last: 'Doe',
      suffix: '',
    };
    // TODO: use backend data instead of placeholders
    const confirmationNumber = '---';
    // TODO: use backend data instead of placeholders
    const submitDate = new Date();

    return (
      <div>
        <div className="print-only">
          <img
            src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
            alt="VA logo"
            width="300"
          />
        </div>
        <p className="vads-u-font-size--h3">
          Equal to Authorization to disclose information to the Department of
          Veterans Affairs (VA) (VA Form 21-4142 & 4142a)
        </p>
        <va-alert
          close-btn-aria-label="Close notification"
          status="success"
          visible
        >
          <h2 slot="headline">
            Thank you for completing your benefit application
          </h2>
          <p className="vads-u-margin-y--0">
            Once we’ve successfully received your application, we’ll contact you
            to tell you what happens next in the application process.
          </p>
        </va-alert>
        <div className="inset">
          <h3 className="vads-u-margin-top--0">Your application information</h3>
          {fullName ? (
            <>
              <h4>Applicant</h4>
              <p>
                {fullName.first} {fullName.middle} {fullName.last}
                {fullName.suffix ? `, ${fullName.suffix}` : null}
              </p>
            </>
          ) : null}

          {confirmationNumber ? (
            <>
              <h4>Confirmation number</h4>
              <p>{confirmationNumber}</p>
            </>
          ) : null}

          {isValid(submitDate) ? (
            <>
              <h4>Date submitted</h4>
              <p>{format(submitDate, 'MMMM d, yyyy')}</p>
            </>
          ) : null}

          <h4>Confirmation for your records</h4>
          <p>You can print this confirmation page for your records</p>
          <button
            type="button"
            className="usa-button vads-u-margin-top--0 screen-only"
            onClick={window.print}
          >
            Print this page
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
