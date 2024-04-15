import React from 'react';
import { Link } from 'react-router';
import { formSubtitle } from '../utils';
import { datesDescription } from './toxicExposure';

export function toxicExposureSummary(
  { formData },
  checkboxObjectName,
  checkboxDefinitions,
  datesObjectName,
  goBackDescription,
  goBackUrlPath,
) {
  const checkboxes = formData[checkboxObjectName];

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
                  {datesDescription(formData[datesObjectName][item])}
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
          Edit locations and dates
        </Link>
      </p>
    </>
  );
}
