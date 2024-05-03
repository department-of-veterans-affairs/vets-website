import React from 'react';
import { Link } from 'react-router';
import { formSubtitle } from '../utils';
import { datesDescription, goBackLink } from './toxicExposure';

/**
 * Summary list used for the end of a Checkbox and Loop flow of the various Toxic Exposure pages
 * @param {object} formData - data for the form
 * @param {string} checkboxObjectName - name of the object containing the checkboxes
 * @param {object} checkboxDefinitions - constant providing the mapping of checkbox keys to display values
 * @param {string} datesObjectName - name of the object containing the locations and date ranges
 * @param {string} goBackDescription - aria label for the go back link
 * @param {string} goBackUrlPath - path to the first page of this Checkbox and Loop flow
 * @returns component for toxic exposure summary
 */
export function toxicExposureSummary(
  { formData },
  checkboxObjectName,
  checkboxDefinitions,
  datesObjectName,
  goBackDescription,
  goBackUrlPath,
) {
  const { toxicExposure } = formData;
  const checkboxes = toxicExposure[checkboxObjectName];

  return (
    <>
      {formSubtitle('Summary')}
      <ul>
        {Object.keys(checkboxes).map(item => {
          return (
            checkboxes[item] === true && (
              <li key={item}>
                <h5 className="vads-u-font-size--h6">
                  {checkboxDefinitions[item]}
                </h5>
                <p className="vads-u-margin-y--1">
                  {datesDescription(toxicExposure[datesObjectName][item])}
                </p>
              </li>
            )
          );
        })}
      </ul>
      <p>
        <Link
          aria-label={goBackDescription}
          to={{
            pathname: goBackUrlPath,
            search: '?redirect',
          }}
        >
          {goBackLink}
        </Link>
      </p>
    </>
  );
}
