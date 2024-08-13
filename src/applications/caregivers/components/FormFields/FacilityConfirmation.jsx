import React from 'react';
import { useSelector } from 'react-redux';

const FacilityConfirmation = () => {
  const data = useSelector(state => state.form.data);
  const selectedFacility = data['view:selectedFacilityAddressData'].attributes;

  return (
    <div>
      <h3>Confirm your health care facilities</h3>
      <h4>The Veteran’s Facility you selected</h4>
      <p>
        This is the facility where you told us the Veteran receives or plans to
        receive treatment.
      </p>
      <p className="va-address-block">
        {selectedFacility.name}
        <br />
        {selectedFacility.address.physical.address1}
        <br />
        {selectedFacility.address.physical.address2}
        <br />
        {selectedFacility.address.physical.address3}
      </p>
    </div>
  );
};

export default FacilityConfirmation;
