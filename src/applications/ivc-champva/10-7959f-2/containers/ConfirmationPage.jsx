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
        </div>
        <VaAlert uswds status="success">
          <h2 className="vads-u-font-size--h3">You've submitted your claim</h2>
        </VaAlert>

        <div className="inset">
          <h2 className="vads-u-margin-top--0 vads-u-font-size--h3">
            Your submission information
          </h2>
          {data.statementOfTruthSignature && (
            <p>
              <strong>This claim was submitted for</strong>
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
        <h2>What to expect after you file your claim</h2>
        <p>
          We'll review your documents. If we need more information, we'll
          contact you.
        </p>
        <p>
          If we decide we can cover your claim, we'll send a U.S. Treasury check
          for the claim amount.
        </p>
        <a href="https://www.va.gov/resources/how-to-file-a-va-foreign-medical-program-claim/#what-to-expect-after-you-file-">
          Learn more about what to expect after you file your claim
        </a>
        <h3 className="vads-u-font-size--h3">
          If we decide we can't cover your claim under FMP
        </h3>
        <p>
          If you disagree with our decision, you can ask us to reconsider our
          decision. We call this an appeal. You must request the appeal within 1
          year of the original decision.
        </p>
        <p>Mail a letter requesting an appeal to this address:</p>
        <p className="va-address-block">
          VHA Office of Integrated Veteran Care
          <br />
          Reconsiderations/Appeals
          <br />
          PO Box 460948
          <br />
          Denver, CO 80246-9028
        </p>
        <p>Include any new information or documents that support your claim.</p>
        <div>
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
