import React from 'react';
import PropTypes from 'prop-types';
import { formatFacilityUnorderedList } from '../../util/facilityHelpers';
import { dataSourceTypes } from '../../util/constants';
import LastUpdatedCard from './LastUpdatedCard';
import HoldTimeInfo from '../shared/HoldTimeInfo';

const BOTH_CONTENT = {
  heading: 'Download your medical records reports',
  getDescription: (
    vistaFacilityNames,
    ohFacilityNamesAfterCutover,
    ohFacilityNamesBeforeCutover,
  ) => (
    <>
      <p>
        You can choose which VA medical records to download as a single report
        (called your VA Blue Button report) or download your self-entered health
        information for these facilities:
      </p>
      {formatFacilityUnorderedList([
        ...vistaFacilityNames,
        ...ohFacilityNamesBeforeCutover,
      ])}
      <p>
        Or you can download your Continuity of Care Document (CCD) to access a
        summary of your medical records for these facilities:
      </p>
      {formatFacilityUnorderedList(ohFacilityNamesAfterCutover)}
    </>
  ),
};

const CONTENT = {
  [dataSourceTypes.OH_ONLY]: BOTH_CONTENT,
  [dataSourceTypes.BOTH]: BOTH_CONTENT,
  [dataSourceTypes.VISTA_ONLY]: {
    heading: 'Download your medical records reports',
    description: (
      <p>
        Download your VA medical records as a single report (called your VA Blue
        Button® report). Or find other reports to download.
      </p>
    ),
  },
};

const IntroSection = ({
  dataSourceType = dataSourceTypes.VISTA_ONLY,
  lastSuccessfulUpdate = null,
  ohFacilityNamesAfterCutover = [],
  ohFacilityNamesBeforeCutover = [],
  vistaFacilityNames = [],
  showHoldTimeMessaging = false,
}) => {
  const content = CONTENT[dataSourceType];
  const description =
    content.getDescription?.(
      vistaFacilityNames,
      ohFacilityNamesAfterCutover,
      ohFacilityNamesBeforeCutover,
    ) || content.description;

  return (
    <>
      <h1>{content.heading}</h1>
      {description}
      {showHoldTimeMessaging && (
        <HoldTimeInfo locationPhrase="in your reports" />
      )}
      <LastUpdatedCard lastSuccessfulUpdate={lastSuccessfulUpdate} />
    </>
  );
};

IntroSection.propTypes = {
  dataSourceType: PropTypes.oneOf(Object.values(dataSourceTypes)),
  lastSuccessfulUpdate: PropTypes.object,
  ohFacilityNamesAfterCutover: PropTypes.arrayOf(PropTypes.node),
  ohFacilityNamesBeforeCutover: PropTypes.arrayOf(PropTypes.node),
  showHoldTimeMessaging: PropTypes.bool,
  vistaFacilityNames: PropTypes.arrayOf(PropTypes.string),
};

export default IntroSection;
