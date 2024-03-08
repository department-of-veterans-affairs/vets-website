import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { makeHumanReadable } from '../../helpers/utilities';

// TODO: update makeHumanReadable() to improve file names

/**
 * Produce either a success message or a link to upload a file
 * @param {object} file Object representing a missing file
 * @param {string} entryName String of a person's name
 * @param {number} index entry index number (used to target list-loop element)
 * @returns JSX
 */
function alertOrLink(file, entryName, index) {
  const t = `Upload ${entryName}'s ${makeHumanReadable(file.name)}`;
  const href = file?.path
    ? `${file?.path.replace(/:index/, index)}?fileReview=true`
    : '';
  return (
    <>
      {file.uploaded ? (
        <VaAlert status="success" showIcon uswds>
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
            {`${entryName}'s `}
            {makeHumanReadable(file.name)} uploaded
          </p>
        </VaAlert>
      ) : (
        <Link aria-label={t} to={href} className="vads-c-action-link--green">
          {t}
        </Link>
      )}
    </>
  );
}

/**
 * Produce an unordered list JSX component with a list of all missing files
 * a user needs to upload.
 * @param {object} param0 data: either an applicant obj or an entire formData obj
 * nameKey: property name to access person's full name (e.g., 'applicantName')
 * title: title text to display
 * description: description text to display
 * disableLinks: whether or not to show link to edit page
 * subset: which classification of files to show: 'required', 'optional', 'all'
 * @returns JSX
 */
export default function MissingFileList({
  data,
  nameKey,
  title,
  description,
  disableLinks,
  subset,
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
      <h4>{title || ''}</h4>
      <p>{description || ''}</p>
      {wrapped.map((entry, idx) => {
        if (entry?.missingUploads.filter(f => inSubset(f)).length === 0)
          return <></>;
        const entryName = `${entry[nameKey].first} ${entry[nameKey]?.middle ||
          ''} ${entry[nameKey].last} ${entry[nameKey]?.suffix || ''}`;
        return (
          <div key={Object.keys(entry).join('') + idx}>
            <strong>{entryName}</strong>
            <ul>
              {entry.missingUploads?.map((file, index) => {
                return inSubset(file) ? (
                  <li key={file.name + file.uploaded + index}>
                    {makeHumanReadable(file.name)}
                    <br />
                    {!disableLinks ? alertOrLink(file, entryName, idx) : null}
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
  nameKey: PropTypes.string,
  subset: PropTypes.string,
  title: PropTypes.string,
};
