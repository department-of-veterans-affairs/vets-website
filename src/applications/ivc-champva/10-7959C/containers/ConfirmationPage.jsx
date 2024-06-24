import React, { useEffect } from 'react';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
    {heading}
    <p>
      You’ll still need to send us these required documents in order for us to
      process this application:
    </p>
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
    fileNameMap: prefixFileNames(data, requiredFiles),
    requiredFiles,
    nonListNameKey: 'applicantName',
    mailingAddress: officeAddress,
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

      <h2 className="vads-u-font-size--h3">What to expect next</h2>
      <p>
        We'll contact you by mail or phone if we have questions or need more
        information.
        <br />
        <br />
        And we'll send you a letter in the mail with our decision.
      </p>
      <div className="inset">
        <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
          Your submission information
        </h3>
        {data.statementOfTruthSignature && (
          <span className="veterans-full-name">
            <strong>Who submitted this form</strong>
            <br />
            {data.statementOfTruthSignature}
            <br />
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
      <a className="vads-c-action-link--green" href="https://www.va.gov/">
        Go back to VA.gov
      </a>
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
