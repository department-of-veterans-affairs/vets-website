import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import PropTypes from 'prop-types';
import { identifyMissingUploads } from '../helpers/supportingDocsVerification';

function checkFlags(person, newListOfMissingFiles) {
  const personUpdated = person; // shallow, updates reflect on actual form state
  if (
    personUpdated?.missingUploads === undefined ||
    personUpdated?.missingUploads?.length === 0
  ) {
    // Track missing files and store if they get subsequently uploaded
    const filesObj = newListOfMissingFiles.map(f => {
      return { name: f, uploaded: false };
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
      if (newListOfMissingFiles.includes(el.name)) {
        missingUploads.push({ ...el, uploaded: false });
      } else {
        missingUploads.push({ ...el, uploaded: true });
      }
    });
    personUpdated.missingUploads = missingUploads; // Update whole object
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
  const pgTmp = contentAfterButtons.props.form.pages;
  const pages = Object.keys(pgTmp).map(pg => pgTmp[pg]);

  // Update all applicants to identify missing uploads
  data.applicants.map(app =>
    // data.applicants will reflect changes
    checkFlags(app, identifyMissingUploads(pages, app, false)),
  );
  // Update sponsor to identify missing uploads
  checkFlags(data, identifyMissingUploads(pages, data, true));

  return (
    <>
      {titleUI('Upload your supporting files')['ui:title']}
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
