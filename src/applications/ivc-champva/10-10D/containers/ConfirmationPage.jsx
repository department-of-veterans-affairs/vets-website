import React, { useEffect } from 'react';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import {
  VaAlert,
  VaLink,
  VaLinkAction,
  VaTelephone,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { requiredFiles, optionalFiles } from '../config/constants';
import MissingFileOverview from '../../shared/components/fileUploads/MissingFileOverview';
import { ConfirmationPagePropTypes } from '../../shared/constants';

const heading = (
  <>
    <VaAlert uswds status="success">
      <h2>You’ve submitted your CHAMPVA application</h2>
    </VaAlert>
  </>
);

const requiredWarningHeading = (
  <>
    {heading}
    <p>
      You’ll still need to send us these required documents in order for us to
      process this application:
    </p>
    {/* <h2>Your next steps</h2> */}
  </>
);

const optionalWarningHeading = (
  <>
    {heading}
    <p>You can still send us these optional documents for faster processing:</p>
  </>
);

export function ConfirmationPage(props) {
  const { form } = props;
  const { submission, data } = form;
  const submitDate = new Date(submission?.timestamp);

  const OverviewComp = MissingFileOverview({
    data: form.data,
    disableLinks: true,
    heading,
    optionalWarningHeading: <>{optionalWarningHeading}</>,
    requiredWarningHeading: <>{requiredWarningHeading}</>,
    showMail: true,
    allPages: form.pages,
    fileNameMap: { ...requiredFiles, ...optionalFiles },
    requiredFiles,
  });

  useEffect(() => {
    focusElement('h2');
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
        <h2>Application for CHAMPVA benefits</h2>
      </div>

      {OverviewComp}

      <div className="inset">
        <h3 className="vads-u-margin-top--0">Your submission information</h3>
        {data.statementOfTruthSignature && (
          <span className="veterans-full-name">
            <strong>Who submitted this form</strong>
            <br />
            {data.statementOfTruthSignature}
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
        It will take approximately 60 days to process your application once
        received by CHAMPVA.
        <br />
        <br />
        If we have any questions, need additional information, or encounter any
        issues, we will contact you.
      </p>
      <h2>How to contact us about your CHAMPVA application</h2>
      <p>
        If you have any questions about your application you can call the
        CHAMPVA call center at <VaTelephone contact="800-733-8387" />. We’re
        here Monday through Friday, 8:05 a.m. to 7:30 p.m. ET.
        <br />
        <br />
        You can also contact us online through our Ask VA tool.
        <br />
        <br />
        <VaLink text="Go to Ask VA" href="https://ask.va.gov/" />
      </p>
      <br />
      <br />
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
