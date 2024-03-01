/**
 * Dynamically get list of applicant property names that correspond to a
 * file upload so we can check if a given applicant has uploaded that
 * particular file without having to hardcode the list of file properties.
 * @param {object} pages contains all pages in current form
 * @returns List of all applicant property names corresponding to a file upload
 */
export function getApplicantFileKeyNames(pages) {
  return (
    Object.keys(pages)
      // Grab pages in the 'applicants' list and loop
      .filter(page => pages[page]?.arrayPath === 'applicants')
      .map(page =>
        // Descend into the page to determine if it has a file upload
        pages[page].schema.properties.applicants.items.map(item =>
          Object.keys(item?.properties).filter(
            key => (item.properties[key].type === 'array' ? key : undefined),
          ),
        ),
      )
      .flat(Infinity) // List of all potential files: ['birthCert', ...]
  );
}

/**
 * Dynamically get list of sponsor property names that correspond to a file
 * upload.
 * @param {object} pages contains all pages in current form
 * @returns List of all sponsor property names corresponding to a file upload
 */
export function getSponsorFileKeyNames(pages) {
  return Object.keys(pages)
    .map(page =>
      Object.keys(pages[page].schema.properties).filter(
        key =>
          pages[page].schema.properties[key].type === 'array' ? key : undefined,
      ),
    )
    .flat(Infinity)
    .filter(el => el !== 'applicants');
}

/**
 * Return list of files user still needs to upload based on current form state
 * @param {object} pages contains all pages in current form
 * @param {object} person either an applicant or the sponsor object
 * @param {boolean} isSponsor whether or not person is the Sponsor
 * @returns List of file-upload properties where no file has been uploaded yet
 */
export function identifyMissingUploads(pages, person, isSponsor) {
  // Get list of possible files (e.g., for sponsor ['dischargePapers', ...])
  const possibleFiles = isSponsor
    ? getSponsorFileKeyNames(pages)
    : getApplicantFileKeyNames(pages);

  // Filter down to just files that haven't been uploaded yet
  return Object.keys(person).filter(
    keyname =>
      possibleFiles.includes(keyname) &&
      [undefined, null].includes(person[keyname]),
  );
}
