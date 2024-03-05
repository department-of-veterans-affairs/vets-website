/**
 * Dynamically get list of applicant property names that correspond to a
 * file upload so we can check if a given applicant has uploaded that
 * particular file without having to hardcode the list of file properties.
 * @param {object} pages contains all pages in current form
 * @returns List of objects describing file upload properties in the shape:
 *   [
 *     {name: 'birthCert', pageUrl: 'birthcert-upload'},
 *   ]
 */
export function getApplicantFileKeyNames(pages) {
  // TODO: Identify if files are required or not and add to obj
  return (
    Object.keys(pages)
      // Grab pages in the 'applicants' list and loop
      .filter(page => pages[page]?.arrayPath === 'applicants')
      .map(page => {
        const { items } = pages[page].schema.properties.applicants;
        const itemProps = Array.isArray(items)
          ? items[0]?.properties // Confirmation page has different page structure
          : items?.properties;
        return Object.keys(itemProps).map(
          item =>
            // Descend into the page to determine if it has a file upload
            itemProps[item]?.type === 'array'
              ? { name: item, path: pages[page].path }
              : undefined,
        );
      })
      .flat(Infinity) // List of all potential files
      .filter(el => el) // Remove undefined values
  );
}

/**
 * Dynamically get list of sponsor property names that correspond to a file
 * upload.
 * @param {object} pages contains all pages in current form
 * @returns List of all sponsor property names corresponding to a file upload
 */
export function getSponsorFileKeyNames(pages) {
  // See "TODO" in getApplicantFileKeyNames
  return Object.keys(pages)
    .map(page =>
      Object.keys(pages[page].schema.properties)
        .filter(
          key =>
            pages[page].schema.properties[key].type === 'array' &&
            key !== 'applicants',
        )
        .map(el => {
          return { name: el, path: undefined };
        }),
    )
    .flat(Infinity);
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
  return possibleFiles.filter(
    file =>
      Object.keys(person).includes(file.name) &&
      person[file.name] === undefined,
  );
}
