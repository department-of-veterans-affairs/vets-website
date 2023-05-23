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
    const preparerNameDefined =
      data.preparerIdentification?.preparerFullName?.first &&
      data.preparerIdentification?.preparerFullName?.last;
    const { first, middle, last, suffix } = preparerNameDefined
      ? data.preparerIdentification.preparerFullName
      : data.veteran.fullName;
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
          <h2 slot="headline">
            Thank you for submitting your authorization request
          </h2>
          <p>
            After we review your application, we'll contact the private provider
            or hospital to get the requested records. If we can't get the
            records within 15 days we'll send you a follow-up letter by mail.
          </p>
        </va-alert>
        <div className="inset">
          <h3 className="vads-u-margin-top--0">Your application information</h3>
          {first && last ? (
            <>
              <h4>Applicant</h4>
              <p>
                {first} {middle ? `${middle} ` : ''}
                {last}
                {suffix ? `, ${suffix}` : null}
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
      first: PropTypes.string,
      middle: PropTypes.string,
      last: PropTypes.string,
      suffix: PropTypes.string,
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
