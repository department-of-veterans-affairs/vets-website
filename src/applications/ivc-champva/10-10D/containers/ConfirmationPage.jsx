import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import MissingFileOverview, {
  mailInfo,
} from '../components/File/MissingFileOverview';

export const missingFileMessage = (
  <section>
    <h2 className="vads-u-font-size--h3">
      Do you need to send us more supporting documents?
    </h2>
    You can mail or fax us copies of these supporting documents for the sponsor
    and applicants.
    <br />
    <br />
    Write the applicant’s name and confirmation number on each page of the
    document.
    <br />
    <br />
    {mailInfo}
    <br />
    <br />
    These are the documents you’ll need to submit by mail:
  </section>
);

const heading = (
  <>
    <VaAlert uswds status="success">
      <h2>You’ve submitted the CHAMPVA benefits enrollment form</h2>
    </VaAlert>
  </>
);

const requiredWarningHeading = (
  <>
    <VaAlert uswds status="warning">
      <h2>
        You’ve submitted the CHAMPVA benefits enrollment form but your
        application is not complete yet
      </h2>
    </VaAlert>
    <p>
      We need to receive your required supporting files before we consider the
      application complete. You can submit these documents via mail or fax.
    </p>
    <h2>Your next steps</h2>
  </>
);

const optionalWarningHeading = (
  <>
    {heading}
    <p>
      Your application is considered complete. There are optional files
      remaining that may speed up your application process if you submit these
      documents via mail or fax.
    </p>
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
        information about this application.
        <br />
        <br />
        And we'll send you a letter in the mail to let you know if we approved
        the application.
      </p>
      <div className="inset">
        <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
          Your submission information
        </h3>
        {data.statementOfTruthSignature ? (
          <span className="veterans-full-name">
            <strong>Who submitted this form</strong>
            <br />
            {data.statementOfTruthSignature}
            <br />
          </span>
        ) : null}
        <br />
        {data.statementOfTruthSignature ? (
          <span className="veterans-full-name">
            <strong>Confirmation number</strong>
            <br />
            {form.submission?.response?.confirmationNumber || ''}
          </span>
        ) : null}
        {isValid(submitDate) ? (
          <p className="date-submitted">
            <strong>Date submitted</strong>
            <br />
            <span>{format(submitDate, 'MMMM d, yyyy')}</span>
          </p>
        ) : null}
        <span className="veterans-full-name">
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

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    pages: PropTypes.object,
    data: PropTypes.shape({
      applicants: PropTypes.array,
      statementOfTruthSignature: PropTypes.string,
      veteransFullName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      response: PropTypes.shape({ confirmationNumber: PropTypes.string }),
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
