import React from 'react';
import PropTypes from 'prop-types';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

const ExpandableOperatingStatus = props => {
  return (
    <AdditionalInfo triggerText={props.status}>Test test test</AdditionalInfo>
  );
};

ExpandableOperatingStatus.propTypes = {
  status: PropTypes.string,
  extraInfo: PropTypes.object,
};

export default ExpandableOperatingStatus;
