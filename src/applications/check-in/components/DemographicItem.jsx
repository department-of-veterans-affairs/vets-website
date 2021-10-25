import React from 'react';
import PropTypes from 'prop-types';
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

DemographicItem.propTypes = {
  demographic: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default DemographicItem;
