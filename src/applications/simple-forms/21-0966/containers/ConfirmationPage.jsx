import React from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import FormFooter from 'platform/forms/components/FormFooter';

import GetFormHelp from '../../shared/components/GetFormHelp';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }

  render() {
    const { form } = this.props;
    const { submission, data } = form;

    const { fullName } = data;
    const submitDate = submission.timestamp;
    const confirmationNumber = submission.response?.confirmationNumber;

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
          <h2 slot="headline">You've submitted your Intent to File request</h2>
          <p>
            Your Intent to File (ITF) for %%claim type%% will expire on %%One
            Year from Date%%.
          </p>
        </va-alert>
        <h3>What are my next steps?</h3>
        <p>
          You should submit your claim as soon as possible. By filing the claim
          today, you may be able to receive retroactive payments based on the
          date you filed your Intent.
        </p>
        {/* TODO: Inject form-data values below after other pages are done. */}
        <p>
          Your ITF for %%claim type%% expires on %%ITF Expiration Date%%. You’ll
          need to submit your claim by this dates in order to receive payments
          starting from your ITF filing date.
        </p>
        <a href="#wip" className="vads-c-action-link--green">
          Start your %%claim type%%
        </a>
        <div className="inset">
          <h3 className="vads-u-margin-top--0">Your submission information</h3>
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
        <a
          className="vads-c-action-link--green vads-u-margin-bottom--4"
          href="/"
        >
          Go back to VA.gov
        </a>
        <div>
          <FormFooter formConfig={{ getHelp: GetFormHelp }} />
        </div>
      </div>
    );
  }
}

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: {
        first: PropTypes.string.isRequired,
        middle: PropTypes.string,
        last: PropTypes.string.isRequired,
        suffix: PropTypes.string,
      },
    }).isRequired,
    submission: PropTypes.shape({
      timestamp: PropTypes.string.isRequired,
      response: PropTypes.shape({
        confirmationNumber: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
