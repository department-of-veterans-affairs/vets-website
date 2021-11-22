import React from 'react';

export default function FacilityRadioBox({
  facility,
  selectedFacilityId,
  onFacilitySelected,
}) {
  const {
    id: facilityId,
    attributes: {
      name: facilityName,
      address: { physical: facilityAddress } = {},
    },
  } = facility;

  const checked = facilityId === selectedFacilityId;

  return (
    <div className="form-radio-buttons" key={facilityId}>
      <input
        type="radio"
        name="facility"
        checked={checked}
        id={`radio-${facilityId}`}
        value={facilityId}
        onChange={() => onFacilitySelected(facilityId)}
      />
      <label htmlFor={`radio-${facilityId}`}>
        <span className="vads-u-display--block vads-u-font-weight--bold">
          {facilityName}
        </span>
        <span className="vads-u-display--block vads-u-font-size--sm">
          {facilityAddress?.city}, {facilityAddress?.state}
        </span>
      </label>
    </div>
  );
}
