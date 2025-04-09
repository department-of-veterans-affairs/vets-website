import React from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';

import { IVC_APPEALS_ADDRESS } from '../../shared/constants';

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
          <h2 className="vads-u-font-size--h3">
            You’ve submitted your FMP claim form
          </h2>
        </VaAlert>

        <div className="inset">
          <h2 className="vads-u-margin-top--0 vads-u-font-size--h3">
            Your submission information
          </h2>
          {data.statementOfTruthSignature && (
            <p>
              <strong>Who submitted this form</strong>
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
        <h2>What to expect next</h2>
        <p>It will take about 90 days to process your application.</p>
        <p>
          If we have any questions or need additional information, we’ll contact
          you.
        </p>
        <h3>If we decide we can cover this claim under FMP</h3>
        <p>We’ll send a U.S. Treasury check for the claim amount.</p>
        <p>
          <b>Note:</b> We’ll convert the claim amount into U.S. dollars when we
          pay your claim. We’ll use the conversion rate from the date you
          received care.
        </p>
        <h3>If we decide we can’t cover your claim under FMP</h3>
        <p>
          If you disagree with our decision, you can ask us to reconsider our
          decision. We call this an appeal. You must request the appeal within{' '}
          <b>1 year</b> of the original decision.
        </p>
        <p>Mail a letter requesting an appeal to this address:</p>
        {IVC_APPEALS_ADDRESS}
        <p>Include any new information or documents that support your claim.</p>
        <a href="https://www.va.gov/resources/how-to-file-a-va-foreign-medical-program-claim/#what-to-expect-after-you-file-">
          Learn more about what to expect after you file your claim
        </a>
        <h2>How to contact us about FMP claims</h2>
        <p>
          If you have any questions about your claim, call us at{' '}
          <va-telephone contact="8339300816" /> (TTY: 711). We’re here Monday
          through Friday, 8:05am to 6:45pm. ET.
        </p>
        <va-link
          href="https://www.va.gov/resources/how-to-file-a-va-foreign-medical-program-claim/#by-phone"
          text="Learn more about how to call us toll-free"
        />
        <p>You can also contact us online through our Ask VA tool.</p>
        <a href="https://ask.va.gov/">Go to Ask VA</a>
        <br />
        <br />
        <a className="vads-c-action-link--green" href="https://www.va.gov/">
          Go back to VA.gov
        </a>
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
