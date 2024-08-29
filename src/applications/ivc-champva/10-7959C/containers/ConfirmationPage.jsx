import React, { useEffect } from 'react';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import {
  VaAlert,
  VaLinkAction,
  VaLink,
  VaTelephone,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  requiredFiles,
  office,
  officeAddress,
  officeFaxNum,
} from '../config/constants';
import { prefixFileNames } from '../components/MissingFileConsentPage';
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
    <VaAlert uswds status="warning">
      <h2>
        You submitted your CHAMPVA Other Health Insurance Certification form
        without required documents
      </h2>
    </VaAlert>
    <p>
      You’ll still need to send us these required documents in order for us to
      process this form:
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
    <p>Write the Beneficiary’s name on each page of the document.</p>
    <p>Mail copies of the documents here: </p>
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
    fileNameMap: prefixFileNames(data, requiredFiles),
    optionalDescription: '',
    requiredDescription: '',
    requiredFiles,
    nonListNameKey: 'applicantName',
    mailingAddress: officeAddress,
    mailPreamble,
    officeName: office,
    faxNum: officeFaxNum,
    showNameHeader: false,
    showRequirementHeaders: false,
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
        <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
          Your submission information
        </h3>
        {(data.statementOfTruthSignature || data.signature) && (
          <span className="veterans-full-name">
            <strong>Who submitted this form</strong>
            <br />
            {data.statementOfTruthSignature || data.signature}
          </span>
        )}
        <br />
        {data.statementOfTruthSignature && (
          <span className="confirmation-number">
            <strong>Confirmation number</strong>
            <br />
            {form.submission?.response?.confirmationNumber}
          </span>
        )}
        {isValid(submitDate) && (
          <p className="date-submitted">
            <strong>Date submitted</strong>
            <br />
            <span>{format(submitDate, 'MMMM d, yyyy')}</span>
          </p>
        )}
        <span className="print-message">
          <strong>Confirmation for your records</strong>
          <br />
          You can print this confirmation for page for your records.
        </span>
        <br />
        <va-button
          uswds
          className="usa-button screen-only"
          onClick={window.print}
          text="Print this page"
        />
      </div>
      <h2 className="vads-u-font-size--h3">What to expect next</h2>
      <p>
        It will take approximately 60 days to process your form once received by
        CHAMPVA.
      </p>
      <p>
        If we have any questions, need additional information, or encounter any
        issues, we will contact you.
      </p>

      <h2 className="vads-u-font-size--h3">
        How to contact us about your form
      </h2>
      <p>
        If you have any questions about your application you can call the
        CHAMPVA call center at <VaTelephone contact="800-733-8387" />. We’re
        here Monday through Friday, 8:05 a.m. to 7:30 p.m. ET.
      </p>
      <p>You can also contact us online through our Ask VA tool.</p>
      <VaLink text="Go to Ask VA" href="https://ask.va.gov/" />
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
