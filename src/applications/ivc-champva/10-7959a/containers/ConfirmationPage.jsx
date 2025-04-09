import React from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { applicantWording } from '../../shared/utilities';

import {
  CHAMPVA_PHONE_NUMBER,
  CHAMPVA_ADDRESS,
  IVC_APPEALS_ADDRESS,
} from '../../shared/constants';

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
          <h2>Application for CHAMPVA benefits</h2>
        </div>

        <va-alert status="success">
          <h2 slot="headline">You’ve submitted your CHAMPVA claim form</h2>
        </va-alert>

        <div className="inset">
          <h3 className="vads-u-margin-top--0">Your submission information</h3>
          {data.applicantName && (
            <>
              <span className="veterans-full-name">
                <strong>Applicant’s name</strong>
                <br />
                {applicantWording(form.data, false, false, false)}
              </span>
              <br />
              <br />
              <span className="signer-name">
                <strong>Who submitted this form</strong>
                <br />
                {data.statementOfTruthSignature || data.signature}
              </span>
            </>
          )}
          {isValid(submitDate) && (
            <p className="date-submitted">
              <strong>Date submitted</strong>
              <br />
              <span>{format(submitDate, 'MMMM d, yyyy')}</span>
            </p>
          )}
          <span>
            You can print this confirmation for page for your records.
          </span>
          <br />
          <br />
          <va-button
            uswds
            className="usa-button screen-only"
            onClick={window.print}
            text="Print this page"
          />
        </div>

        <h2>What to expect next</h2>
        <p>It will take about 90 days to process your claim.</p>
        <p>
          If we have any questions or need additional information, we'll contact
          you.
        </p>
        <h3>If we decide we can cover this claim under CHAMPVA</h3>
        <p>
          We’ll send you an explanation of benefits. This document explains
          details about the amount we'll cover.
        </p>
        <h3>If we decide we can’t cover this claim under CHAMPVA</h3>
        <p>
          If you disagree with our decision, you can ask us to reconsider our
          decision. We call this an appeal.
          <br />
          <br />
          Mail a letter requesting an appeal to this address:
        </p>
        {IVC_APPEALS_ADDRESS}
        <h2>How to contact us about CHAMPVA claims</h2>
        <p>
          If you have any questions about your claim, call us at{' '}
          <va-telephone contact={CHAMPVA_PHONE_NUMBER} /> (TTY: 711). We’re here
          Monday through Friday, 8:05 a.m. to 7:30 p.m. ET.
          <br />
          <br />
          Or you can send us a letter with questions about your claim to this
          address:
          <br />
          {CHAMPVA_ADDRESS}
          <p>You can also contact us online through Ask VA.</p>
          <va-link href="https://ask.va.gov/" text="Go to Ask VA" />
        </p>
        <va-link-action href="/" text="Go back to VA.gov" />
      </div>
    );
  }
}

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      applicantName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
      statementOfTruthSignature: PropTypes.string,
      signature: PropTypes.string,
    }),
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
