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
import { REQUIRED_FILES, OPTIONAL_FILES } from '../config/constants';
import MissingFileOverview from '../../shared/components/fileUploads/MissingFileOverview';
import {
  ConfirmationPagePropTypes,
  CHAMPVA_FAX_NUMBER,
  CHAMPVA_ADDRESS,
  CHAMPVA_PHONE_NUMBER,
} from '../../shared/constants';

const heading = (
  <>
    <VaAlert uswds status="success">
      <h2>You’ve submitted your CHAMPVA benefits application</h2>
    </VaAlert>
  </>
);

const requiredWarningHeading = (
  <>
    <VaAlert uswds status="warning">
      <h2>
        You’ve submitted your CHAMPVA benefits application without required
        documents
      </h2>
    </VaAlert>
    <h2>You still need to mail supporting documents</h2>
    <p>
      We can’t review your application until we receive copies of these
      documents.
    </p>
  </>
);

const optionalWarningHeading = (
  <>
    {heading}
    <p>You can still send us these optional documents for faster processing:</p>
  </>
);

const mailPreamble = (
  <>
    <a
      rel="noreferrer"
      href="https://www.va.gov/family-and-caregiver-benefits/health-and-disability/champva/#supporting-documents-for-your"
      target="_blank"
    >
      Learn more about the supporting documents you need to submit (opens in a
      new tab)
    </a>

    <p>
      Write the sponsor’s first and last name and last four digits of their
      Social Security number on each page of the document.
    </p>

    <p>Mail copies of the supporting documents to this address:</p>
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
    showRequirementHeaders: false,
    requiredDescription: '',
    optionalWarningHeading: <>{optionalWarningHeading}</>,
    requiredWarningHeading: <>{requiredWarningHeading}</>,
    showMail: true,
    mailPreamble,
    mailingAddress: CHAMPVA_ADDRESS,
    faxNum: CHAMPVA_FAX_NUMBER,
    allPages: form.pages,
    fileNameMap: { ...REQUIRED_FILES, ...OPTIONAL_FILES },
    requiredFiles: REQUIRED_FILES,
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
        {/* It will take about 90 days to process your application. */}
        <b>Note:</b> Right now there's a delay in processing CHAMPVA{' '}
        applications. We expect this delay to be temporary. If you have
        questions about the status of your application, call us at{' '}
        <VaTelephone contact={CHAMPVA_PHONE_NUMBER} /> (TTY: 711). We’re here
        Monday through Friday, 8:05 a.m. to 7:30 p.m. ET.
        <br />
        <br />
        If we have any questions or need additional information, we’ll contact
        you.
      </p>
      <h2>How to contact us about your application</h2>
      <p>
        If you have any questions about your application you can call the
        CHAMPVA call center at <VaTelephone contact={CHAMPVA_PHONE_NUMBER} />.
        We’re here Monday through Friday, 8:05 a.m. to 7:30 p.m. ET.
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
