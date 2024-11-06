import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

const FacilityConfirmation = props => {
  const { data, goBack, goForward, goToPath } = props;
  const selectedFacility = data['view:plannedClinic'].veteranSelected;
  const selectedCaregiverSupportFacility =
    data['view:plannedClinic'].caregiverSupport;

  const isReviewPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('review') === 'true';
  };

  const onGoForward = () => {
    if (isReviewPage()) {
      goToPath('/review-and-submit');
    } else {
      goForward(data);
    }
  };

  const onGoBack = () => {
    if (isReviewPage()) {
      goToPath('/veteran-information/va-medical-center/locator?review=true');
    } else {
      goBack();
    }
  };

  const addressText = facility => {
    return (
      <>
        <h5 className="vads-u-font-size--h4 vads-u-margin-top--0">
          {facility.name}
        </h5>
        {facility?.address?.physical?.address1 && (
          <>
            {facility.address.physical.address1}
            <br role="presentation" />
          </>
        )}
        {facility?.address?.physical?.address2 && (
          <>
            {facility.address.physical.address2}
            <br role="presentation" />
          </>
        )}
        {facility?.address?.physical?.address3 && (
          <>{facility.address.physical.address3}</>
        )}
      </>
    );
  };

  return (
    <div>
      <h3>Confirm your health care facilities</h3>
      <h4>The Veteran’s facility you selected</h4>
      <p>
        This is the facility where you told us the Veteran receives or plans to
        receive treatment.
      </p>
      <va-card>{addressText(selectedFacility)}</va-card>
      <h4>Your assigned caregiver support facility</h4>
      <p>
        This is the facility we’ve assigned to support you in the application
        process and has a caregiver support coordinator on staff. The
        coordinator at this facility will support you through the application
        process.
      </p>
      <p className="va-address-block">
        {addressText(selectedCaregiverSupportFacility)}
      </p>
      <FormNavButtons goBack={onGoBack} goForward={onGoForward} />
    </div>
  );
};

FacilityConfirmation.propTypes = {
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
};

export default FacilityConfirmation;
