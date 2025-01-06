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
        <strong className="vads-u-font-size--h4 vads-u-margin-top--0">
          {facility.name}
        </strong>
        <br role="presentation" />
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
      <h3>Caregiver support location</h3>
      <p>
        This is the location we’ve assigned to support the caregiver in the
        application process:
      </p>
      <p className="va-address-block">
        {addressText(selectedCaregiverSupportFacility)}
      </p>
      <p>
        This VA health facility has a Caregiver Support Team coordinator. And
        this facility is closest to where the Veteran receives or plans to
        receive care.
      </p>
      <h4>The Veteran’s VA health facility</h4>
      <p>
        The Veteran will still receive their health care at the facility you
        selected:
      </p>
      <p className="va-address-block">{addressText(selectedFacility)}</p>
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
