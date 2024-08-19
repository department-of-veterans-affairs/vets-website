import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import { formSubtitle } from '../utils';
import {
  datesDescription,
  getOtherFieldDescription,
  goBackLink,
  goBackLinkExposures,
} from '../content/toxicExposure';

/**
 * Summary list used for the end of a Checkbox and Loop flow of the various Toxic Exposure pages
 */
export function ToxicExposureSummary({
  formData,
  checkboxObjectName,
  checkboxDefinitions,
  datesObjectName,
  otherObjectName = '',
  goBackDescription,
  goBackUrlPath,
}) {
  const { toxicExposure } = formData;
  const checkboxes = toxicExposure[checkboxObjectName];
  const otherFieldDescription = getOtherFieldDescription(
    formData,
    otherObjectName,
  );

  return (
    <>
      {formSubtitle('Summary')}
      <ul>
        {Object.keys(checkboxes)
          .filter(item => item !== 'none' && item !== 'notsure')
          .map(item => {
            return (
              checkboxes[item] === true && (
                <li key={item}>
                  <strong>{checkboxDefinitions[item]}</strong>
                  <p className="vads-u-margin-y--0">
                    {datesDescription(toxicExposure[datesObjectName][item])}
                  </p>
                </li>
              )
            );
          })}
        {otherFieldDescription && (
          <li key="other">
            <strong>{toxicExposure[otherObjectName].description}</strong>
            <p className="vads-u-margin-y--0">
              {datesDescription(toxicExposure[otherObjectName])}
            </p>
          </li>
        )}
      </ul>
      <p>
        <Link
          aria-label={goBackDescription}
          to={{
            pathname: goBackUrlPath,
            search: '?redirect',
          }}
        >
          {checkboxObjectName === 'otherExposures'
            ? goBackLinkExposures
            : goBackLink}
        </Link>
      </p>
    </>
  );
}

ToxicExposureSummary.propTypes = {
  /**
   * Constant providing the mapping of checkbox keys to display values
   */
  checkboxDefinitions: PropTypes.object.isRequired,
  /**
   * Name of the object containing the checkboxes
   */
  checkboxObjectName: PropTypes.string.isRequired,
  /**
   * Name of the object containing the locations and date ranges
   */
  datesObjectName: PropTypes.string.isRequired,
  /**
   * Data for the form
   */
  formData: PropTypes.shape({
    toxicExposure: PropTypes.any,
  }).isRequired,
  /**
   * Path to the first page of this Checkbox and Loop flow
   */
  goBackUrlPath: PropTypes.string.isRequired,
  /**
   * Aria label for the go back link
   */
  goBackDescription: PropTypes.string,
  /**
   * Name of the object containg an 'other' field info
   */
  otherObjectName: PropTypes.string,
};
