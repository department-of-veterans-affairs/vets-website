import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  ADDITIONAL_EXPOSURES,
  GULF_WAR_1990_LOCATIONS,
  GULF_WAR_2001_LOCATIONS,
  HERBICIDE_LOCATIONS,
  TE_URL_PREFIX,
} from '../constants';
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
      <ul className="vads-u-margin-top--0">
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
   * Name of the object containg an 'other' field info
   */
  otherObjectName: PropTypes.string,
};

export const AdditionalExposuresSummaryDescription = ({ formData }) => (
  <ToxicExposureSummary
    formData={formData}
    checkboxObjectName="otherExposures"
    checkboxDefinitions={ADDITIONAL_EXPOSURES}
    datesObjectName="otherExposuresDetails"
    goBackUrlPath={`${TE_URL_PREFIX}/additional-exposures`}
    otherObjectName="specifyOtherExposures"
  />
);

AdditionalExposuresSummaryDescription.propTypes = {
  formData: PropTypes.object.isRequired,
};

export const GulfWar1990SummaryDescription = ({ formData }) => (
  <ToxicExposureSummary
    formData={formData}
    checkboxObjectName="gulfWar1990"
    checkboxDefinitions={GULF_WAR_1990_LOCATIONS}
    datesObjectName="gulfWar1990Details"
    goBackUrlPath={`${TE_URL_PREFIX}/gulf-war-1990`}
  />
);

GulfWar1990SummaryDescription.propTypes = {
  formData: PropTypes.object.isRequired,
};

export const GulfWar2001SummaryDescription = ({ formData }) => (
  <ToxicExposureSummary
    formData={formData}
    checkboxObjectName="gulfWar2001"
    checkboxDefinitions={GULF_WAR_2001_LOCATIONS}
    datesObjectName="gulfWar2001Details"
    goBackUrlPath={`${TE_URL_PREFIX}/gulf-war-2001`}
  />
);

GulfWar2001SummaryDescription.propTypes = {
  formData: PropTypes.object.isRequired,
};

export const HerbicideSummaryDescription = ({ formData }) => (
  <ToxicExposureSummary
    formData={formData}
    checkboxObjectName="herbicide"
    checkboxDefinitions={HERBICIDE_LOCATIONS}
    datesObjectName="herbicideDetails"
    goBackUrlPath={`${TE_URL_PREFIX}/herbicide`}
    otherObjectName="otherHerbicideLocations"
  />
);

HerbicideSummaryDescription.propTypes = {
  formData: PropTypes.object.isRequired,
};
