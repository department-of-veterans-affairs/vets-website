import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

const FacilityConfirmation = props => {
  const { data, goBack, goForward } = props;
  const selectedFacility =
    data['view:plannedClinic'].veteranSelected.attributes;

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
      <FormNavButtons goBack={goBack} goForward={goForward} />
    </div>
  );
};

FacilityConfirmation.propTypes = {
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

export default FacilityConfirmation;
