import React from 'react';
import PropTypes from 'prop-types';
import { buildOperatingStatusProps } from '../buildOperatingStatusProps';
import VAFacilityAddress from './VAFacilityAddress';
import VAFacilityTitle from './VAFacilityTitle';
import VAFacilityPhone from './VAFacilityPhone';

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
        <VAFacilityPhone phoneNumber={phoneNumber} />
      </>
    );
  };

  return (
    <>
      <VAFacilityTitle vaFacility={props.vetCenter} />
      {opStatusConfig && (
        <div className="vads-u-margin-bottom--1">
          <va-alert-expandable
            id={`operating-status-alert-${
              props.vetCenter.fieldFacilityLocatorApiId
            }`}
            data-testid={`operating-status-alert-${
              props.vetCenter.fieldFacilityLocatorApiId
            }`}
            status={opStatusConfig.statusType}
            trigger={opStatusConfig.statusLabel}
            class="vads-u-margin-y--0 vamc-facility-expandable-alert"
            style={{ maxWidth: '303px' }}
          >
            <div>
              {(opStatusConfig.extraInfo || '').split('\n').map((line, i) => (
                <p
                  key={`${props.vetCenter.fieldFacilityLocatorApiId}-line-${i}`}
                >
                  {line}
                </p>
              ))}
            </div>
          </va-alert-expandable>
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
