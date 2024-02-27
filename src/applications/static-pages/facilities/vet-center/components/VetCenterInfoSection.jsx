import React from 'react';
import PropTypes from 'prop-types';
import ExpandableOperatingStatus from './ExpandableOperatingStatus';
import { buildOperatingStatusProps } from '../buildOperatingStatusProps';
import VAFacilityAddress from './VAFacilityAddress';

function VetCenterInfoSection(props) {
  const attrs = {
    opStatus: props.vetCenter.fieldOperatingStatusFacility,
    opStatusExtra: props.vetCenter.fieldOperatingStatusMoreInfo,
  };

  const opStatusConfig = buildOperatingStatusProps(attrs);

  const renderPhone = phoneNumber => {
    if (!phoneNumber) return null;
    return (
      <>
        <h4 className="force-small-header vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1">
          Phone
        </h4>
        <div className="main-phone">
          <strong />
          <va-telephone contact={phoneNumber} />
        </div>
      </>
    );
  };

  return (
    <>
      {props.vetCenter.title && (
        <h3 className="vads-u-margin-bottom--1 vads-u-margin-top--0 vads-u-font-size--md vads-u-font-size--lg">
          {props.vetCenter.title}
        </h3>
      )}
      {opStatusConfig && (
        <div className="vads-u-margin-bottom--1">
          <ExpandableOperatingStatus {...opStatusConfig} />
        </div>
      )}
      <h4 className="force-small-header vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1">
        {props.vetCenter.entityBundle === 'vet_center_cap'
          ? 'Located at'
          : 'Address'}
      </h4>
      <div className="vads-u-margin-bottom--2">
        <VAFacilityAddress vaFacility={props.vetCenter} />
      </div>
      {props.vetCenter.entityBundle === 'vet_center_cap'
        ? renderPhone(props.mainVetCenterPhone)
        : renderPhone(props.vetCenter.fieldPhoneNumber)}
    </>
  );
}

VetCenterInfoSection.propTypes = {
  mainVetCenterPhone: PropTypes.string,
  vetCenter: PropTypes.object,
};

export default VetCenterInfoSection;
