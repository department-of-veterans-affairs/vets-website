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
    const { submission, data } = form;
    const submitDate = new Date(submission?.timestamp);

    const fullName = Object.values(data?.applicantName || {})
      .filter(el => el)
      .join(' ');

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
          {fullName && (
            <span className="veterans-full-name">
              <strong>CHAMPVA claim (Form 10-7959a)</strong>
              <br />
              For {fullName}
              <br />
            </span>
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
        <p>
          It will take approximately 90 days to process your claim once received
          by CHAMPVA.
          <br />
          <br />
          We’ll review your documents. If we need more information, we’ll
          contact you.
        </p>
        <h3>If we decide we can cover this claim under CHAMPVA</h3>
        <p>
          We’ll send you an explanation of benefits. This document explains the
          amount we’ll cover and the amount you’ll need to pay.
        </p>
        <h3>If we decide we can’t cover this claim under CHAMPVA</h3>
        <p>
          If you disagree with our decision, you can ask us to reconsider our
          decision. We call this an appeal.
          <br />
          <br />
          Mail a letter requesting an appeal to this address:
        </p>
        <p className="va-address-block">
          VHA Office of Integrated Veteran Care
          <br />
          ATTN: APPEALS
          <br />
          PO Box 460948
          <br />
          Denver, CO 80246-0948
          <br />
        </p>
        <h2>How to contact us about CHAMPVA claims</h2>
        <p>
          If you have any questions about your form you can call us at at{' '}
          <va-telephone contact="8007338387" /> (TTY: 711). We’re here Monday
          through Friday, 8:05 a.m. to 7:30 p.m. ET.
          <br />
          <br />
          Or you can send us a letter with questions about your claim to this
          address:
          <br />
          <p className="va-address-block">
            VHA Office of Integrated Veteran Care
            <br />
            ATTN: CHAMPVA Claims
            <br />
            PO Box 460948
            <br />
            Denver, CO 80246-0948
            <br />
          </p>
          <p>You can also contact us online through Ask VA.</p>
          <va-link
            href="https://ask.va.gov/"
            text="Contact us online through Ask VA"
          />
        </p>
        <br />
        <br />
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
