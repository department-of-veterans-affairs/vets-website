import React from 'react';
import AddressBlock from './AddressBlock';
import { formatDemographicString } from '../utils/formatters';

const DemographicItem = ({ demographic }) => {
  let demographicDisplay;

  if (typeof demographic === 'object') {
    demographicDisplay = <AddressBlock address={demographic} />;
  } else {
    demographicDisplay = formatDemographicString(demographic);
  }

  return <>{demographicDisplay}</>;
};

export default DemographicItem;
