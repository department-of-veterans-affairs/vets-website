import React, { useEffect } from 'react';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';

import { scrollToTop } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import {
  VaLink,
  VaLinkAction,
  VaTelephone,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  ConfirmationPagePropTypes,
  CHAMPVA_PHONE_NUMBER,
} from '../../shared/constants';

export function ConfirmationPage(props) {
  const { form } = props;
  const { submission, data } = form;
  const submitDate = new Date(submission?.timestamp);

  useEffect(() => {
    focusElement('h1');
    scrollToTop('topScrollElement');
  }, []);

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
      </div>
      <va-alert status="success">
        <h2>You've submitted your CHAMPVA benefits application</h2>
      </va-alert>
      <div className="inset">
        <h2 className="vads-u-margin-top--0 vads-u-font-size--h3">
          Your submission information
        </h2>
        {data.statementOfTruthSignature && (
          <span className="veterans-full-name">
            <strong>Who submitted this form</strong>
            <br />
            <span className="dd-privacy-hidden">
              {data.statementOfTruthSignature}
            </span>
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
        <span className="veterans-full-name">
          <strong>Confirmation for your records</strong>
          <br />
          You can print this confirmation for page for your records
        </span>
        <br />
        <br />
        <va-button
          className="usa-button screen-only"
          onClick={window.print}
          text="Print this page"
        />
      </div>

      <h2>What to expect next</h2>
      <p>
        It will take about 60 days to process your application.
        <br />
        <br />
        If we have any questions or need additional information, we’ll contact
        you.
      </p>
      <h2>How to contact us about your application</h2>
      <p>
        If you have any questions about your application, call us at{' '}
        <VaTelephone contact={CHAMPVA_PHONE_NUMBER} /> (TTY: 711). We’re here
        Monday through Friday, 8:05 a.m. to 7:30 p.m. ET.
        <br />
        <br />
        You can also contact us online through our Ask VA tool.
        <br />
        <br />
        <VaLink text="Go to Ask VA" href="https://ask.va.gov/" />
      </p>
      <VaLinkAction href="/" text="Go back to VA.gov" />
    </div>
  );
}

ConfirmationPage.propTypes = ConfirmationPagePropTypes;

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
