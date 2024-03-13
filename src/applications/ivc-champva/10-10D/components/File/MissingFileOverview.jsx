import React, { useState } from 'react';
import {
  VaAlert,
  VaCheckboxGroup,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import PropTypes from 'prop-types';
import {
  identifyMissingUploads,
  getConditionalPages,
} from '../../helpers/supportingDocsVerification';
import MissingFileList from './MissingFileList';

export const mailInfo = (
  <>
    Mail your files to:
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
        United States of America
      </p>
    </address>
    Or fax your documents here:
    <br />
    VHA Office of Community Care CHAMPVA Eligibility, 303-331-7809
  </>
);

export const optionalDescription =
  'These files are not required to complete your application, but may prevent delays in your processing time.';
export const requiredDescription =
  'These files are required to complete your application';

// Return a boolean if there are any missing uploads where 'required'
// matches expectedVal. Optionally use dropUploaded if you want to ignore
// required files that have already been uploaded.
export function hasReq(data, expectedVal, dropUploaded = false) {
  const wrapped = Array.isArray(data) ? data : [data];
  return wrapped.some(el =>
    el.missingUploads.some(
      file =>
        file.required === expectedVal && (dropUploaded ? !file.uploaded : true),
    ),
  );
}

// Helper function to manage object that tracks which files a user
// has uploaded/still needs to upload
export function checkFlags(pages, person, newListOfMissingFiles) {
  const personUpdated = person; // shallow, updates reflect on actual form state
  const wrapped = Array.isArray(pages)
    ? pages
    : Object.keys(pages).map(pg => pages[pg]); // On confirmation, "pages" is obj

  // Update missingUploads to account for any changes in conditional pages
  personUpdated.missingUploads = personUpdated?.missingUploads?.filter(el =>
    wrapped.flatMap(pg => pg.path).includes(el.path),
  );

  if (
    personUpdated?.missingUploads === undefined ||
    personUpdated?.missingUploads?.length === 0
  ) {
    // Track missing files and store if they get subsequently uploaded
    const filesObj = newListOfMissingFiles.map(file => {
      return { ...file, uploaded: false };
    });
    personUpdated.missingUploads = filesObj;
  } else {
    /*
    Update the object created previously if they have uploaded a file
    since it was identified as missing.
    This lets us show the "Success" message for a file that was previously
    missing but has since been uploaded.
    */
    const missingUploads = [];
    personUpdated.missingUploads.forEach(el => {
      if (newListOfMissingFiles.flatMap(file => file.name).includes(el.name)) {
        missingUploads.push({ ...el, uploaded: false });
      } else {
        missingUploads.push({ ...el, uploaded: true });
      }
    });

    // Update with any conditionally shown uploads that weren't in last list
    const fm = personUpdated.missingUploads.flatMap(el => el.name);
    newListOfMissingFiles.forEach(
      el =>
        !fm.includes(el.name)
          ? missingUploads.push({ ...el, uploaded: false })
          : null,
    );
    personUpdated.missingUploads = missingUploads; // Shallow
  }
  return personUpdated;
}

export default function MissingFileOverview({
  contentAfterButtons,
  data,
  goBack,
  goForward,
  setFormData,
  disableLinks,
  heading,
  optionalWarningHeading,
  requiredWarningHeading,
  showMail,
  showConsent,
  allPages,
}) {
  const [error, setError] = useState(undefined);
  const [isChecked, setIsChecked] = useState(
    data?.consentToMailMissingRequiredFiles || false,
  );
  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const chapters = contentAfterButtons?.props?.formConfig?.chapters;
  // Create single list of pages from multiple chapter objects
  const pages =
    allPages ||
    Object.keys(chapters)
      .map(ch => chapters?.[ch]?.pages)
      .map(ch => Object.keys(ch).map(k => ch[k]))
      .flat(1);

  // eslint-disable-next-line no-unused-vars
  const apps =
    // Filter out any conditional pages that don't apply to this applicant
    data.applicants.map(app => {
      const tmpData = { ...data, applicants: [app] };
      const conditionalPages = getConditionalPages(pages, tmpData, 0);

      // data.applicants will reflect changes
      return checkFlags(
        conditionalPages,
        app,
        identifyMissingUploads(conditionalPages, app, false),
      );
    });

  const applicantsWithMissingFiles = data.applicants
    .map(applicant => {
      const missing = identifyMissingUploads(
        getConditionalPages(pages, { ...data, applicants: [applicant] }, 0),
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

  // Update sponsor to identify missing uploads
  const sponsorMiss = {
    name: data.veteransFullName,
    missingUploads: checkFlags(
      pages,
      data,
      identifyMissingUploads(getConditionalPages(pages, data), data, true),
    ).missingUploads,
  };

  const requiredFilesStillMissing =
    hasReq(sponsorMiss, true, showConsent) ||
    hasReq(applicantsWithMissingFiles, true, showConsent);

  const filesAreMissing =
    requiredFilesStillMissing ||
    hasReq(sponsorMiss, false, showConsent) ||
    hasReq(apps, false, showConsent);

  const onGroupChange = event => {
    setIsChecked(event.detail.checked);
    return requiredFilesStillMissing && !event.detail.checked
      ? setError('This field is required')
      : setError(undefined);
  };

  const onGoForward = args => {
    args.preventDefault();
    // Prevent user advancing if acknowledgement box is unchecked
    if (showConsent === true && requiredFilesStillMissing && !isChecked) {
      setError('This field is required');
      return;
    }
    setFormData({
      ...data,
      consentToMailMissingRequiredFiles: isChecked,
    });
    goForward(args);
  };

  const defaultHeading = (
    <>
      {titleUI('Upload your supporting files')['ui:title']}
      {filesAreMissing ? (
        <>
          <p>
            <i>
              Any required supporting files that are not uploaded will need to
              be mailed in before your application is considered complete
            </i>
          </p>
          <p>
            If you choose not to upload your files, we’ll provide instructions
            on how to send them to us by mail or fax.
          </p>
          <p>Uploading may result in a faster processing time.</p>
        </>
      ) : null}
    </>
  );

  let displayHeading = defaultHeading;
  if (requiredWarningHeading && requiredFilesStillMissing) {
    displayHeading = requiredWarningHeading;
  } else if (optionalWarningHeading && filesAreMissing) {
    displayHeading = optionalWarningHeading;
  } else if (heading && !requiredFilesStillMissing && !showConsent) {
    displayHeading = heading;
  }
  return (
    <form onSubmit={onGoForward}>
      {displayHeading}

      {filesAreMissing ? (
        <>
          {hasReq(sponsorMiss, true, showConsent) ? (
            <MissingFileList
              data={sponsorMiss}
              nameKey="name"
              title="Required"
              subset="required"
              description={requiredDescription}
              disableLinks={disableLinks}
            />
          ) : null}

          {hasReq(sponsorMiss, false, showConsent) ? (
            <MissingFileList
              data={sponsorMiss}
              nameKey="name"
              title="Optional"
              subset="optional"
              description={optionalDescription}
              disableLinks={disableLinks}
            />
          ) : null}
          {hasReq(apps, true, showConsent) ? (
            <MissingFileList
              data={apps}
              nameKey="applicantName"
              title="Required"
              subset="required"
              description={requiredDescription}
              disableLinks={disableLinks}
            />
          ) : null}
          {hasReq(apps, false, showConsent) ? (
            <MissingFileList
              data={apps}
              nameKey="applicantName"
              title="Optional"
              subset="optional"
              description={optionalDescription}
              disableLinks={disableLinks}
            />
          ) : null}
          {requiredFilesStillMissing && showMail ? (
            <>
              {mailInfo}
              Your application will be considered complete upon submission
            </>
          ) : null}
          {requiredFilesStillMissing && showConsent ? (
            <>
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
            </>
          ) : null}
        </>
      ) : null}
      {goForward && !filesAreMissing ? (
        <>
          <VaAlert status="success" uswds>
            <h2>All supporting files uploaded</h2>
            <p>
              You will not need to mail or fax in any files. Your application
              will be considered complete upon submission
            </p>
          </VaAlert>
          <p>
            You will not need to take any further action after submission of
            your application.
          </p>
        </>
      ) : null}

      {goForward ? navButtons : null}
    </form>
  );
}

MissingFileOverview.propTypes = {
  allPages: PropTypes.any,
  contentAfterButtons: PropTypes.object,
  data: PropTypes.object,
  disableLinks: PropTypes.bool,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  heading: PropTypes.node,
  optionalWarningHeading: PropTypes.node,
  requiredWarningHeading: PropTypes.node,
  setFormData: PropTypes.func,
  showConsent: PropTypes.bool,
  showMail: PropTypes.bool,
};
