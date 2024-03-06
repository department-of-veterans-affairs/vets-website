import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  VaAlert,
  VaCheckboxGroup,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  identifyMissingUploads,
  getConditionalPages,
} from '../helpers/supportingDocsVerification';
import MissingFileList from '../components/File/MissingFileList';
import { mailInfo } from '../containers/ConfirmationPage';
import {
  optionalDescription,
  requiredDescription,
} from './SupportingDocumentsPage';

// Return a boolean if there are any missing uploads where 'required'
// matches expectedVal
export function hasReq(data, isSponsor, expectedVal) {
  return isSponsor
    ? data.missingUploads.some(file => file.required === expectedVal)
    : data.some(el =>
        el.missingUploads.some(file => file.required === expectedVal),
      );
}

export function MissingFileConsentPage(props) {
  const { data } = props;
  const { form } = props.contentAfterButtons.props;
  const { veteransFullName } = data;
  const [error, setError] = useState(undefined);
  const [isChecked, setIsChecked] = useState(
    data.consentToMailMissingRequiredFiles || false,
  );

  const applicantsWithMissingFiles = data.applicants
    .map(applicant => {
      const missing = identifyMissingUploads(
        getConditionalPages(
          form.pages,
          { ...data, applicants: [applicant] },
          0,
        ),
        applicant,
        false,
      );
      if (missing.length !== 0) {
        return {
          name: applicant.applicantName,
          missingUploads: missing,
        };
      }
      return undefined;
    })
    .filter(el => el);

  const sponsorMissingFiles = {
    name: veteransFullName,
    missingUploads: identifyMissingUploads(
      getConditionalPages(form.pages, data),
      data,
      true,
    ),
  };

  const requiredFilesStillMissing =
    hasReq(sponsorMissingFiles, true, true) ||
    hasReq(applicantsWithMissingFiles, false, true);

  // Get the right alert
  const alert = requiredFilesStillMissing ? (
    <VaAlert uswds status="warning">
      <h2>You have not uploaded all required supporting documents</h2>
      <p>{requiredDescription}</p>
    </VaAlert>
  ) : (
    <VaAlert uswds status="warning">
      <h2>You have not uploaded all optional supporting documents</h2>
      <p>{optionalDescription}</p>
    </VaAlert>
  );

  const onGroupChange = event => {
    setIsChecked(event.detail.checked);
    return requiredFilesStillMissing && !event.detail.checked
      ? setError('This field is required')
      : setError(undefined);
  };

  const onGoForward = args => {
    args.preventDefault();
    // Prevent user advancing if acknowledgement box is unchecked
    if (requiredFilesStillMissing && !isChecked) {
      setError('This field is required');
      return;
    }
    props.setFormData({
      ...data,
      consentToMailMissingRequiredFiles: isChecked,
    });
    props.goForward(args);
  };

  const navButtons = <FormNavButtons goBack={props.goBack} submitToContinue />;

  useEffect(() => {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }, []);

  return (
    <form onSubmit={onGoForward}>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
        <h2>Application for CHAMPVA benefits</h2>
      </div>
      {alert}
      {hasReq(sponsorMissingFiles, true, true) ? (
        <MissingFileList
          data={sponsorMissingFiles}
          nameKey="name"
          title="Required"
          description={requiredDescription}
          disableLinks
          subset="required"
        />
      ) : null}
      {hasReq(sponsorMissingFiles, true, false) ? (
        <MissingFileList
          data={sponsorMissingFiles}
          nameKey="name"
          title="Optional"
          description={optionalDescription}
          disableLinks
          subset="optional"
        />
      ) : null}
      {hasReq(applicantsWithMissingFiles, false, true) ? (
        <MissingFileList
          data={applicantsWithMissingFiles}
          nameKey="name"
          title="Required"
          description={requiredDescription}
          disableLinks
          subset="required"
        />
      ) : null}
      {hasReq(applicantsWithMissingFiles, false, false) ? (
        <MissingFileList
          data={applicantsWithMissingFiles}
          nameKey="name"
          title="Optional"
          description={optionalDescription}
          disableLinks
          subset="optional"
        />
      ) : null}
      {sponsorMissingFiles.missingUploads || applicantsWithMissingFiles ? (
        <>
          {mailInfo()}
          Your application will be considered complete upon submission
        </>
      ) : null}

      <h3>Supporting files acknowledgement</h3>
      <VaCheckboxGroup onVaChange={onGroupChange} error={error}>
        {requiredFilesStillMissing ? (
          <>
            <va-checkbox
              hint={null}
              required
              label="I understand that my application is not complete until VA receives my remaining required file(s) in the mail or by fax."
              onBlur={function noRefCheck() {}}
              checked={isChecked}
              tile
              uswds
            />
          </>
        ) : null}
      </VaCheckboxGroup>
      {navButtons}
    </form>
  );
}

MissingFileConsentPage.propTypes = {
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
