import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { identifyMissingUploads } from '../helpers/supportingDocsVerification';
import { makeHumanReadable } from '../helpers/utilities';

export function ConfirmationPage(props) {
  const { form } = props;
  const { submission, data } = form;
  const submitDate = new Date(submission?.timestamp);
  const { veteransFullName } = data;

  const applicantsWithMissingFiles = data.applicants
    .map(applicant => {
      const missing = identifyMissingUploads(form.pages, applicant, false);
      if (missing.length !== 0) {
        return {
          name: `${applicant.applicantName.first} ${
            applicant.applicantName.last
          }`,
          files: identifyMissingUploads(form.pages, applicant, false).map(f =>
            makeHumanReadable(f),
          ),
        };
      }
      return undefined;
    })
    .filter(el => el);

  const sponsorMissingFiles = identifyMissingUploads(
    form.pages,
    data,
    true,
  ).map(f => makeHumanReadable(f));

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
      <VaAlert uswds status="success">
        <h2>You've submitted the CHAMPVA benefits enrollment form</h2>
      </VaAlert>
      <h2 className="vads-u-font-size--h3">
        Your application has been submitted
      </h2>
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
      {sponsorMissingFiles || applicantsWithMissingFiles ? (
        <section>
          <h2 className="vads-u-font-size--h3">
            Do you need to send us more supporting documents?
          </h2>
          You can mail or fax us copies of these supporting documents for the
          sponsor and applicants.
          <br />
          <br />
          Write the applicant's name and confirmation number on each page of the
          document.
          <br />
          <br />
          Mail your documents here:
          <address className="vads-u-border-color--primary vads-u-border-left--4px vads-u-margin-left--3">
            <p className="vads-u-padding-x--10px vads-u-margin-left--1">
              VHA Office of Community Care
              <br />
              CHAMPVA Eligibility
              <br />
              P.O. Box 469028
              <br />
              Denver, CO 80246-9028
              <br />
              UnitedStates of America
            </p>
          </address>
          Or fax your documents here:
          <br />
          VHA Office of Community Care CHAMPVA Eligibility, 303-331-7809
          <br />
          <br />
          These are the documents you'll need to submit by mail:
        </section>
      ) : null}
      {sponsorMissingFiles ? (
        <section>
          <p>
            <strong>
              {veteransFullName?.first} {veteransFullName?.last}:
            </strong>
          </p>
          <ul>
            {sponsorMissingFiles.map((file, idx) => (
              <li key={`${file}-${idx}`}>{file}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {applicantsWithMissingFiles
        ? applicantsWithMissingFiles.map((app, idx) => (
            <section key={`${app.name}-${idx}`}>
              <p>
                <strong>{app.name}:</strong>
              </p>
              <ul>
                {app.files.map(f => (
                  <li key={`${app.name}-${idx}-${f}`}>{f}</li>
                ))}
              </ul>
            </section>
          ))
        : null}
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
