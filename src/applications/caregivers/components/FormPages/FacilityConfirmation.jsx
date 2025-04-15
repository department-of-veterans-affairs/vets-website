import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

// declare routes for page navigation when in review mode
export const reviewModeRoutes = {
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

  const onGoBack = useCallback(
    () => (isReviewPage ? goToPath(reviewModeRoutes.back) : goBack()),
    [goBack, goToPath, isReviewPage],
  );

  const onGoForward = useCallback(
    () => (isReviewPage ? goToPath(reviewModeRoutes.forward) : goForward(data)),
    [data, goForward, goToPath, isReviewPage],
  );

  const renderAddress = facility => {
    if (!facility) return null;

    const { name, address: { physical } = {} } = facility;
    const addressText = [
      physical?.address1,
      physical?.address2,
      physical?.address3,
    ]
      .filter(Boolean)
      .map((line, index, src) => (
        <React.Fragment key={line}>
          {line}
          {index < src.length - 1 && <br role="presentation" />}
        </React.Fragment>
      ));

    return (
      <p className="va-address-block">
        {name && (
          <>
            <strong className="vads-u-font-size--h4 vads-u-margin-top--0">
              {name}
            </strong>
            <br role="presentation" />
          </>
        )}
        {addressText}
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
      <FormNavButtons goBack={onGoBack} goForward={onGoForward} />
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
