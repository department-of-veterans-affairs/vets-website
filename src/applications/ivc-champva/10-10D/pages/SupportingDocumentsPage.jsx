import React, { useState } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import PropTypes from 'prop-types';
import {
  identifyMissingUploads,
  getConditionalPages,
} from '../helpers/supportingDocsVerification';
import MissingFileList from '../components/File/MissingFileList';

/**
 * TODO:
 * - Implement way to tell if files are required or optional
 *   - Add proper wording to top of page based on required status
 * - Create follow-on page:
 *   - Add checkbox acknowledging if any files have to be mailed in
 */

// TODO: find this wording elsewhere and collapse vars
const optionalDescription =
  'These files are not required to complete your application, but may prevent delays in your processing time.';
// const requiredDescription =
//  'These files are required to complete your application';

export function checkFlags(pages, person, newListOfMissingFiles) {
  // TODO: in here, add a flag that indicates if upload is required
  const personUpdated = person; // shallow, updates reflect on actual form state

  // Update missingUploads to account for any changes in conditional pages
  personUpdated.missingUploads = personUpdated?.missingUploads?.filter(el =>
    pages.flatMap(pg => pg.path).includes(el.path),
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

export default function SupportingDocumentsPage({
  contentAfterButtons,
  data,
  goBack,
  goForward,
}) {
  const navButtons = <FormNavButtons goBack={goBack} goForward={goForward} />;
  const { chapters } = contentAfterButtons.props.formConfig;
  // Create single list of pages from multiple chapter objects
  const pages = Object.keys(chapters)
    .map(ch => chapters?.[ch]?.pages)
    .map(ch => Object.keys(ch).map(k => ch[k]))
    .flat(1);

  // eslint-disable-next-line no-unused-vars
  const [apps, setApps] = useState(
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
    }),
  );

  // Update sponsor to identify missing uploads (not in use currently)
  // checkFlags(data, identifyMissingUploads(pages, data, true));

  const filesAreMissing = apps
    .flatMap(app => app.missingUploads)
    .some(file => file.uploaded === false);

  return (
    <>
      {/* TODO: conditional logic here based on required or optional */}
      {titleUI('Upload your supporting files')['ui:title']}
      {filesAreMissing ? (
        <MissingFileList
          data={apps}
          nameKey="applicantName"
          title="Optional"
          description={optionalDescription}
        />
      ) : (
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
      )}

      {navButtons}
    </>
  );
}

SupportingDocumentsPage.propTypes = {
  contentAfterButtons: PropTypes.object,
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};
