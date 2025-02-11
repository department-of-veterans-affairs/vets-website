import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FLOW_TYPES } from '../../../../../utils/constants';
import State from '../../../../../components/State';
import { getFlowType } from '../../../../redux/selectors';

export default function FacilitySection({ facility, clinic }) {
  const flowType = useSelector(getFlowType);

  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">Facility</h2>
      {facility.name}
      <br />
      {facility.address?.city}, <State state={facility.address?.state} />
      {FLOW_TYPES.DIRECT === flowType && (
        <>
          <br />
          <br />
          <span>Clinic: {clinic.serviceName || 'Not available'}</span>
        </>
      )}
    </>
  );
}
FacilitySection.propTypes = {
  facility: PropTypes.object.isRequired,
  clinic: PropTypes.object,
};
