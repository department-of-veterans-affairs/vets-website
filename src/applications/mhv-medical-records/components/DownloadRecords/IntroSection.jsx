import React from 'react';
import PropTypes from 'prop-types';
import { formatFacilityUnorderedList } from '../../util/facilityHelpers';
import { dataSourceTypes } from '../../util/constants';
import LastUpdatedCard from './LastUpdatedCard';
import HoldTimeInfo from '../shared/HoldTimeInfo';

const CONTENT = {
  [dataSourceTypes.OH_ONLY]: {
    heading: 'Download your medical records report',
    description: (
      <p>
        Download your Continuity of Care Document (CCD), a summary of your VA
        medical records.
      </p>
    ),
  },
  [dataSourceTypes.BOTH]: {
    heading: 'Download your medical records reports',
    getDescription: (vistaFacilityNames, ohFacilityNames) => (
      <>
        <p>
          You can download your VA medical records as a single report (called
          your VA Blue Button report) or download your self-entered health
          information for these facilities:
        </p>
        {formatFacilityUnorderedList(vistaFacilityNames)}
        <p>
          VA medical records for these facilities aren’t available in your Blue
          Button report right now. Download your Continuity of Care Document
          (CCD) to access medical records for these facilities:
        </p>
        {formatFacilityUnorderedList(ohFacilityNames)}
      </>
    ),
  },
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
  ohFacilityNames = [],
  vistaFacilityNames = [],
  showHoldTimeMessaging = false,
}) => {
  const content = CONTENT[dataSourceType];
  const description =
    content.getDescription?.(vistaFacilityNames, ohFacilityNames) ||
    content.description;

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
  ohFacilityNames: PropTypes.arrayOf(PropTypes.string),
  showHoldTimeMessaging: PropTypes.bool,
  vistaFacilityNames: PropTypes.arrayOf(PropTypes.string),
};

export default IntroSection;
