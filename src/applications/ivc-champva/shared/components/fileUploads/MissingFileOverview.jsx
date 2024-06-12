/*
OVERVIEW:
The MissingFileOverview component is responsible for tracking file uploads
within the form and displaying a message to the user indicating which files
they have yet to upload before the application is considered complete. 

MOTIVATION:
We want to let a user fill out as much of the form as possible and submit it,
even if it's technically incomplete due to a missing file (e.g., birth certificate).
However, we still need to track what files are required to complete the form and
inform the user of their necessity. 

IMPLEMENTATION:
Rather than setting the `required` property on file uploads (which would prevent
a user from submitting the form if they're missing a file), we have a list of
files that are "required", but not enforced by the form itself. This component
then checks the form data and compares it against our list of required documents
so that we can inform the user before submission that their application is not
complete. We also provide the user with information on mailing or faxing these
required documents after form submission so that they can kick off the process
by submitting online and then complete it later through the mail.

This component provides the user with details on what is missing, and
(optionally) links to return back to the necessary upload screens so they
can upload the files. Otherwise, it can provide a consent checkbox where the
user acknowledges that they will have to mail or fax the missing documents.
*/
import React, { useState } from 'react';
import {
  VaCheckboxGroup,
  VaTelephone,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import PropTypes from 'prop-types';
import { getConditionalPages } from '../../utilities';
import SupportingDocsVerification from './supportingDocsVerification';
import MissingFileList from './MissingFileList';

const mailInfo = (showOpt = true, address, officeName, faxNum) => (
  <>
    <p>
      Your application will not be considered complete until VA receives all of
      your remaining required files.
    </p>
    {showOpt ? (
      <p>
        Optional files are not required to complete your application, but may
        prevent delays in your processing time.
        <br />
      </p>
    ) : null}
    Mail your documents to:
    <address className="vads-u-border-color--primary vads-u-border-left--4px vads-u-margin-left--3">
      <p className="vads-u-padding-x--10px vads-u-margin-left--1">
        {address ?? (
          <>
            VHA Office of Community Care
            <br />
            CHAMPVA Eligibility
            <br />
            P.O. Box 469028
            <br />
            Denver, CO 80246-9028
            <br />
            United States of America
          </>
        )}
      </p>
    </address>
    Or fax your documents here:
    <br />
    {officeName ?? ''},<br />
    <VaTelephone
      contact={JSON.stringify({
        phoneNumber: faxNum ?? '3033317809',
        description: 'fax number',
      })}
    />
    <br />
  </>
);

export const optionalDescription =
  'These documents help us process this application faster.';
export const requiredDescription =
  'We require these documents in order to process this form.';

// Return a boolean if there are any missing uploads where 'required'
// matches expectedVal. Optionally use dropUploaded if you want to ignore
// required files that have already been uploaded.
export function hasReq(data, expectedVal, dropUploaded = false) {
  const wrapped = Array.isArray(data) ? data : [data];
  return wrapped.some(el =>
    el?.missingUploads?.some(
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

/**
 * Generates a page that displays any missing file the user could upload
 * @param {object} param0
 * @param {object} param0.contentAfterButtons - standard `contentAfterButtons` prop provided to a CustomPage (only used if `allPages` is not defined)
 * @param {object} param0.data - form data entered by user
 * @param {function} param0.goBack - standard `goBack` fn provided to a CustomPage
 * @param {function} param0.goForward - standard `goForward` fn provided to a CustomPage
 * @param {function} param0.setFormData - standard `setFormData` fn provided to a CustomPage
 * @param {boolean} param0.disableLinks - control whether page renders links to go back and upload the particular missing file
 * @param {JSX.Element} param0.heading - content to display when user has uploaded all files
 * @param {JSX.Element} param0.optionalWarningHeading - content to display when user is missing optional file uploads
 * @param {JSX.Element} param0.requiredWarningHeading - content to display when user is missing required file uploads
 * @param {boolean} param0.showMail - control whether mail/fax markup is displayed on the page
 * @param {JSX.Element} param0.mailingAddress - Mailing address to send missing files to
 * @param {string} param0.officeName - Name of office to mail documents to
 * @param {string} param0.faxNum - Number where documents can be faxed
 * @param {boolean} param0.showConsent - control whether the "Consent to Mail Missing Documents" checkbox is added to the page
 * @param {object} param0.allPages - all formConfig page objects (if not provided, we fall back to form page data stored in `contentAfterButtons`)
 * @param {object} param0.fileNameMap - object with formConfig keys for all possible files (required and optional) mapped to a user-friendly string (e.g., `{schoolCert: 'School Certificate'}`). This should be a superset containing `requiredFiles`
 * @param {object} param0.requiredFiles - object with required file's formConfig keys mapped to a user-friendly string (e.g., `{birthCert: 'Birth Certificate'}`)
 * @param {string} param0.nonListNameKey - key in `data` that points to a name property to use in the page display (e.g., if nonListNameKey is `veteranFullName`, `data.veteranFullName` should be something like `{first: '', last: ''}`
 * @param {boolean} param0.showNameHeader - whether or not to show the person's name above their grouping of missing files
 * @param {boolean} param0.showFileBullets - whether or not to show the file type in a separate <li> above the clickable link (only works when `param0.disableLinks===false`)
 * @param {boolean} param0.showRequirementHeaders - whether or not to show "[Required/Optional] documents" above each section
 * @returns {JSX.Element}
 */
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
  mailingAddress,
  officeName,
  faxNum,
  showConsent,
  allPages,
  fileNameMap,
  requiredFiles,
  nonListNameKey,
  showNameHeader,
  showFileBullets,
  showRequirementHeaders,
}) {
  const [error, setError] = useState(undefined);
  const [isChecked, setIsChecked] = useState(
    data?.consentToMailMissingRequiredFiles || false,
  );
  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const chapters = contentAfterButtons?.props?.formConfig?.chapters;
  const verifier = new SupportingDocsVerification(requiredFiles);
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
    data?.applicants?.map(app => {
      const tmpData = { ...data, applicants: [app] };
      const conditionalPages = getConditionalPages(pages, tmpData, 0);

      // data.applicants will reflect changes
      return checkFlags(
        conditionalPages,
        app,
        verifier.identifyMissingUploads(conditionalPages, app, false),
      );
    });

  const applicantsWithMissingFiles = data?.applicants
    ?.map(applicant => {
      const missing = verifier.identifyMissingUploads(
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
    name: data?.[nonListNameKey || 'veteransFullName'],
    missingUploads: checkFlags(
      pages,
      data,
      verifier.identifyMissingUploads(
        getConditionalPages(pages, data),
        data,
        true,
      ),
    ).missingUploads,
  };

  const requiredFilesStillMissing =
    hasReq(sponsorMiss, true, showConsent) ||
    hasReq(applicantsWithMissingFiles, true, showConsent);

  const optionalFilesStillMissing =
    hasReq(sponsorMiss, false, showConsent) || hasReq(apps, false, showConsent);

  const filesAreMissing =
    requiredFilesStillMissing || optionalFilesStillMissing;

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
      {titleUI('Upload your supporting documents')['ui:title']}
      {filesAreMissing && !showConsent ? (
        <p>
          Upload now for faster processing. Or you can send them by mail or fax.
        </p>
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

  // Set up some display properties:
  const rh = showRequirementHeaders ?? true ? 'Required documents' : '';
  const oh = showRequirementHeaders ?? true ? 'Optional documents' : '';
  const snh = showNameHeader ?? true;
  const sfb = showFileBullets ?? false;

  return (
    <form onSubmit={onGoForward}>
      {displayHeading}

      {filesAreMissing ? (
        <>
          {hasReq(sponsorMiss, true, showConsent) ? (
            <MissingFileList
              data={sponsorMiss}
              nameKey="name"
              title={rh}
              subset
              description={requiredDescription}
              disableLinks={disableLinks}
              fileNameMap={fileNameMap}
              showNameHeader={snh}
              showFileBullets={sfb}
            />
          ) : null}
          {hasReq(apps, true, showConsent) ? (
            <MissingFileList
              data={apps}
              nameKey="applicantName"
              title={rh}
              subset
              description={requiredDescription}
              disableLinks={disableLinks}
              fileNameMap={fileNameMap}
              showNameHeader={snh}
              showFileBullets={sfb}
            />
          ) : null}
          {hasReq(sponsorMiss, false, showConsent) ? (
            <MissingFileList
              data={sponsorMiss}
              nameKey="name"
              title={oh}
              description={optionalDescription}
              disableLinks={disableLinks}
              fileNameMap={fileNameMap}
              showNameHeader={snh}
              showFileBullets={sfb}
            />
          ) : null}
          {hasReq(apps, false, showConsent) ? (
            <MissingFileList
              data={apps}
              nameKey="applicantName"
              title={oh}
              description={optionalDescription}
              disableLinks={disableLinks}
              fileNameMap={fileNameMap}
              showNameHeader={snh}
              showFileBullets={sfb}
            />
          ) : null}
          {requiredFilesStillMissing && showMail ? (
            <>
              {mailInfo(
                optionalFilesStillMissing,
                mailingAddress,
                officeName,
                faxNum,
              )}
            </>
          ) : null}
          {requiredFilesStillMissing && showConsent ? (
            <>
              <h3>Supporting documents acknowledgement</h3>
              <VaCheckboxGroup onVaChange={onGroupChange} error={error}>
                {requiredFilesStillMissing ? (
                  <>
                    <va-checkbox
                      hint={null}
                      required
                      label="I understand that VA can’t process this form until they receive any required documents by mail or fax"
                      onBlur={function noRefCheck() {}}
                      checked={isChecked}
                      name="consent-checkbox"
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
      {goForward ? navButtons : null}
    </form>
  );
}

MissingFileOverview.propTypes = {
  allPages: PropTypes.any,
  contentAfterButtons: PropTypes.object,
  data: PropTypes.object,
  disableLinks: PropTypes.bool,
  faxNum: PropTypes.string,
  fileNameMap: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  heading: PropTypes.node,
  mailingAddress: PropTypes.any,
  nonListNameKey: PropTypes.string,
  officeName: PropTypes.string,
  optionalWarningHeading: PropTypes.node,
  requiredFiles: PropTypes.any,
  requiredWarningHeading: PropTypes.node,
  setFormData: PropTypes.func,
  showConsent: PropTypes.bool,
  showFileBullets: PropTypes.bool,
  showMail: PropTypes.bool,
  showNameHeader: PropTypes.bool,
  showRequirementHeaders: PropTypes.bool,
};

// For use by components that wrap MissingFileOverview in a custompage
export const MissingFileConsentPagePropTypes = {
  contentAfterButtons: PropTypes.object,
  data: PropTypes.object,
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
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  name: PropTypes.string,
  setFormData: PropTypes.func,
};
