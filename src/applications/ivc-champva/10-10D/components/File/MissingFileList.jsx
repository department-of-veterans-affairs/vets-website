import React from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { makeHumanReadable } from '../../helpers/utilities';

// TODO: update makeHumanReadable() to improve file names

/**
 * Produce either a success message or a link to upload a file
 * @param {object} file Object representing a missing file
 * @param {string} entryName String of a person's name
 * @returns JSX
 */
function alertOrLink(file, entryName) {
  return (
    <>
      {file.uploaded ? (
        <VaAlert status="success" showIcon uswds>
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
            {entryName} {"'s "}
            {makeHumanReadable(file.name)} uploaded
          </p>
        </VaAlert>
      ) : (
        <a className="vads-c-action-link--green" href="/ivc-champva/10-10D">
          Upload {entryName} {"'s "}
          {makeHumanReadable(file.name)}
        </a>
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
 * @returns JSX
 */
export default function MissingFileList({ data, nameKey, title, description }) {
  // data: an array or a single object, must have 'missingUploads' on it
  const wrapped = Array.isArray(data) ? data : [data];
  if (wrapped.length > 0 && wrapped[0].missingUploads.length === 0) return '';
  return (
    <div>
      <h4>{title || ''}</h4>
      <p>{description || ''}</p>
      {wrapped.map(entry => {
        const entryName = `${entry[nameKey].first} ${entry[nameKey]?.middle ||
          ''} ${entry[nameKey].last} ${entry[nameKey]?.suffix || ''}`;
        return (
          <div key={entry}>
            <strong>{entryName}</strong>
            <ul>
              {entry.missingUploads?.map((file, index) => {
                return (
                  <div key={file.name + file.uploaded + index}>
                    <li>{makeHumanReadable(file.name)}</li>
                    {alertOrLink(file, entryName)}
                  </div>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

MissingFileList.propTypes = {
  data: PropTypes.array || PropTypes.object,
  description: PropTypes.string,
  nameKey: PropTypes.string,
  title: PropTypes.string,
};
