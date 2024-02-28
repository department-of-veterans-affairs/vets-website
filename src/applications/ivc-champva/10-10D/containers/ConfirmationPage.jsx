import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { identifyMissingUploads } from '../helpers/supportingDocsVerification';

export function ConfirmationPage(props) {
  const { form } = props;
  const { submission, formId, data } = form;
  const submitDate = new Date(submission?.timestamp);
  const { veteransFullName } = data;

  // TODO: memoize this
  const applicantsWithMissingFiles = data.applicants
    .map(applicant => {
      const missing = identifyMissingUploads(form.pages, applicant, false);
      if (missing.length !== 0) {
        return {
          name: `${applicant.applicantName.first} ${
            applicant.applicantName.last
          }`,
          files: identifyMissingUploads(form.pages, applicant, false),
        };
      }
      return undefined;
    })
    .filter(el => el);

  // TODO:
  // - have a map of file keys to pretty filenames ? or just de-camelcase
  const sponsorMissingFiles = identifyMissingUploads(form.pages, data, true);

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
        <h2>Application for Mock Form</h2>
      </div>
      <h2 className="vads-u-font-size--h3">
        Your application has been submitted
      </h2>
      <p>We may contact you for more information or documents.</p>
      <p className="screen-only">Please print this page for your records.</p>
      <div className="inset">
        <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
          Application for CHAMPVA Benefits Claim{' '}
          <span className="vads-u-font-weight--normal">(Form {formId})</span>
        </h3>
        {data.statementOfTruthSignature ? (
          <span className="veterans-full-name">
            <strong>Who submitted this form</strong>
            <br />
            {data.statementOfTruthSignature}
          </span>
        ) : null}

        {isValid(submitDate) ? (
          <p className="date-submitted">
            <strong>Date submitted</strong>
            <br />
            <span>{format(submitDate, 'MMMM d, yyyy')}</span>
          </p>
        ) : null}
        <button
          type="button"
          className="usa-button screen-only"
          onClick={window.print}
        >
          Print this for your records
        </button>
      </div>
      <h2 className="vads-u-font-size--h3">
        Do you need to send us more supporting documents?
      </h2>
      {sponsorMissingFiles ? (
        <>
          <p>
            <strong>
              {veteransFullName.first} {veteransFullName.last}:
            </strong>
          </p>
          <ul>
            {sponsorMissingFiles.map((file, idx) => (
              <li key={`${file}-${idx}`}>{file}</li>
            ))}
          </ul>
        </>
      ) : null}

      {applicantsWithMissingFiles
        ? applicantsWithMissingFiles.map((app, idx) => (
            <div key={`${app.name}-${idx}`}>
              <p>
                <strong>{app.name}:</strong>
              </p>
              <ul>
                {app.files.map(f => (
                  <li key={`${app.name}-${idx}-${f}`}>{f}</li>
                ))}
              </ul>
            </div>
          ))
        : null}
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
