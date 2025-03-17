import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

// declare routes for page navigation
const navRoutes = {
  back: '/veteran-information/va-medical-center/locator?review=true',
  forward: '/review-and-submit',
};

const FacilityConfirmation = ({ data, goBack, goForward, goToPath }) => {
  const selectedFacility = data?.['view:plannedClinic']?.veteranSelected;
  const selectedCaregiverSupportFacility =
    data?.['view:plannedClinic']?.caregiverSupport;

  const isReviewPage = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('review') === 'true';
  }, []);

  const handleNavigation = (path, fallback) =>
    isReviewPage ? goToPath(path) : fallback(data);

  const renderAddress = facility => {
    if (!facility) return null;
    const { name, address } = facility;
    const { physical } = address || {};
    const LineBreak = <br role="presentation" />;
    return (
      <p className="va-address-block">
        {name && (
          <>
            <strong className="vads-u-font-size--h4 vads-u-margin-top--0">
              {name}
            </strong>
            {LineBreak}
          </>
        )}
        {physical?.address1 && (
          <>
            {physical.address1}
            {LineBreak}
          </>
        )}
        {physical?.address2 && (
          <>
            {physical.address2}
            {LineBreak}
          </>
        )}
        {physical?.address3 && <>{physical.address3}</>}
      </p>
    );
  };

  return (
    <>
      <h3>Caregiver support location</h3>
      <p>
        This is the location we’ve assigned to support the caregiver in the
        application process:
      </p>
      {renderAddress(selectedCaregiverSupportFacility)}
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
      {renderAddress(selectedFacility)}
      <FormNavButtons
        goBack={handleNavigation(navRoutes.back, goBack)}
        goForward={handleNavigation(navRoutes.forward, goForward)}
      />
    </>
  );
};

FacilityConfirmation.propTypes = {
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
};

export default FacilityConfirmation;
