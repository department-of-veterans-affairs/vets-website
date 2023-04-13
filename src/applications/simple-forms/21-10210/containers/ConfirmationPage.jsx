import React from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import GetFormHelp from '../components/GetFormHelp';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }

  render() {
    const { form } = this.props;
    // TODO: Once form-pages are built, include formId and data in form prop
    // [uncomment line below and delete line below that]
    // const { submission, formId, data } = form;
    const { submission } = form;
    const submitDate = new Date(submission?.timestamp);

    // TODO: Once form-pages are built, grab fullName from form data
    // [uncomment line below and delete line below that]
    // const { fullName } = data;
    const fullName = { first: 'John', middle: 'M', last: 'Doe', suffix: 'Jr.' };

    const confirmationNumber =
      submission?.response?.attributes?.confirmationNumber;

    return (
      <div>
        <div className="print-only">
          <img
            src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
            alt="VA logo"
            width="300"
          />
        </div>
        <va-alert
          close-btn-aria-label="Close notification"
          status="success"
          visible
        >
          <h2 slot="headline" className="vads-u-font-size--h3">
            You've successfully submitted your Lay/Witness Statement
          </h2>
          <p className="vads-u-margin-bottom--0">
            Once we’ve reviewed your submission, a coordinator will contact you
            to discuss next steps.
          </p>
        </va-alert>
        <div className="inset">
          <h2 className="vads-u-margin-top--0 vads-u-font-size--h3">
            Your application information
          </h2>
          {fullName && (
            <>
              <h3 className="vads-u-font-size--h4">Applicant</h3>
              <p>
                {fullName.first} {fullName.middle} {fullName.last}
                {fullName.suffix ? `, ${fullName.suffix}` : null}
              </p>
            </>
          )}

          {confirmationNumber && (
            <>
              <h3 className="vads-u-font-size--h4">Confirmation number</h3>
              <p>{confirmationNumber}</p>
            </>
          )}

          {isValid(submitDate) && (
            <>
              <h3 className="vads-u-font-size--h4">Date submitted</h3>
              <p>{format(submitDate, 'MMMM d, yyyy')}</p>
            </>
          )}

          <h3 className="vads-u-font-size--h4">
            Confirmation for your records
          </h3>
          <p>You can print this confirmation page for your records</p>
          <button
            type="button"
            className="usa-button screen-only"
            onClick={window.print}
          >
            Print this page
          </button>
        </div>
        <a
          className="vads-c-action-link--green vads-u-margin-bottom--4"
          href="/"
        >
          Go back to VA.gov
        </a>
        <h3 className="help-heading">Need help?</h3>
        <GetFormHelp />
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
