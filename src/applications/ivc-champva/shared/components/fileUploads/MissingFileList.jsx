import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { makeHumanReadable } from '../../utilities';

/**
 * Produce either a success message or a link to upload a file
 * @param {object} file Object representing a missing file
 * @param {string} entryName String of a person's name
 * @param {number} index entry index number (used to target list-loop element)
 * @param {object} fileNameDict (optional) Mapping of file names to arbitrary display text
 * @returns JSX
 */
function alertOrLink(file, entryName, index, fileNameDict = {}) {
  const fn = fileNameDict?.[file.name] ?? makeHumanReadable(file.name);
  const t = `Upload ${entryName}’s ${fn}`;
  const href = file?.path
    ? `${file?.path.replace(/:index/, index)}?fileReview=true`
    : '';
  return (
    <>
      {file.uploaded ? (
        <VaAlert status="success" showIcon uswds>
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
            {`${entryName}’s`} {fn} uploaded
          </p>
        </VaAlert>
      ) : (
        <Link aria-label={t} to={href} className="vads-c-action-link--blue">
          {t}
        </Link>
      )}
    </>
  );
}

/**
 * Produce an unordered list JSX component with a list of all missing files
 * a user needs to upload.
 * @param {object} param0
 * @param {object} param0.data: either an entire formData obj or a subset of that data. Must contain a property that matches the `nameKey` passed to this function.
 * @param {string} param0.nameKey: property name to access person's full name (e.g., `applicantName`)
 * @param {string} param0.title: title text to display
 * @param {string} param0.description: description text to display
 * @param {boolean} param0.disableLinks: whether or not to show link to edit page
 * @param {string} param0.subset: which classification of files to show: 'required', 'optional', 'all'
 * @param {object} param0.filenameMap: (optional) all file names mapped to user-friendly labels
 * @returns JSX
 */
export default function MissingFileList({
  data,
  nameKey,
  title,
  description,
  disableLinks,
  subset,
  fileNameMap,
}) {
  const inSubset = file => {
    if (subset === 'required') {
      return file.required === true;
    }
    if (subset === 'optional') {
      return file.required === false;
    }
    return true; // Show all if subset is other
  };
  // data: an array or a single object, must have 'missingUploads' on it
  const wrapped = Array.isArray(data) ? data : [data];
  if (
    wrapped.length > 0 &&
    wrapped
      .flatMap(app => app.missingUploads)
      .every(file => file.uploaded === true) &&
    disableLinks
  )
    return <></>;

  return (
    <div>
      <h3 className="vads-u-font-size--h4">{title || ''}</h3>
      <p>{description || ''}</p>
      {wrapped.map((entry, idx) => {
        if (entry?.missingUploads.filter(f => inSubset(f)).length === 0)
          return <></>;
        const entryName = `${entry[nameKey].first} ${entry[nameKey]?.middle ||
          ''} ${entry[nameKey].last}${entry[nameKey]?.suffix || ''}`;
        return (
          <div key={`${entryName}-${subset}`}>
            <strong>{entryName}</strong>
            <ul style={!disableLinks ? { listStyleType: 'none' } : {}}>
              {entry.missingUploads?.map((file, index) => {
                return inSubset(file) &&
                  (disableLinks ? file.uploaded === false : true) ? (
                  <li key={file.name + file.uploaded + index}>
                    {!disableLinks
                      ? alertOrLink(file, entryName, idx, fileNameMap)
                      : fileNameMap?.[file.name] ??
                        makeHumanReadable(file.name)}
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

MissingFileList.propTypes = {
  data: PropTypes.any,
  description: PropTypes.string,
  disableLinks: PropTypes.bool,
  fileNameMap: PropTypes.any,
  nameKey: PropTypes.string,
  subset: PropTypes.string,
  title: PropTypes.string,
};
