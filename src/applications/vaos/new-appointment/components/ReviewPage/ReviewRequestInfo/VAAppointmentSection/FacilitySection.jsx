import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FLOW_TYPES } from '../../../../../utils/constants';
import State from '../../../../../components/State';
import { getFlowType } from '../../../../redux/selectors';

export default function FacilitySection({ facility }) {
  const flowType = useSelector(getFlowType);

  if (FLOW_TYPES.DIRECT === flowType)
    return (
      <>
        <h3 className="vaos-appts__block-label">{facility.name}</h3>
        {facility.address?.city}, <State state={facility.address?.state} />
      </>
    );

  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">Facility</h2>
      {facility.name}
      <br />
      {facility.address?.city}, <State state={facility.address?.state} />
    </>
  );
}
FacilitySection.propTypes = {
  facility: PropTypes.object.isRequired,
};
