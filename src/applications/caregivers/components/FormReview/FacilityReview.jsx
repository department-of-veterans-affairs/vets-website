import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import content from '../../locales/en/content.json';

const FacilityReview = ({ data, goToPath }) => {
  const plannedClinic = data['view:plannedClinic'];
  const veteranSelectedFacility = plannedClinic.veteranSelected;
  const selectedCaregiverSupportFacility = plannedClinic.caregiverSupport;

  const hasAssignedFacility = useMemo(
    () => veteranSelectedFacility?.id !== selectedCaregiverSupportFacility?.id,
    [selectedCaregiverSupportFacility?.id, veteranSelectedFacility?.id],
  );

  const handleEditClick = useCallback(
    () =>
      goToPath('/veteran-information/va-medical-center/locator?review=true'),
    [goToPath],
  );

  return (
    <div className="form-review-panel-page">
      <form className="rjsf" noValidate="">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            {content['vet-med-center-search-description']}
          </h4>
          <va-button
            text={content['button-edit']}
            label={content['facilities-review--edit-aria-label']}
            onClick={handleEditClick}
            secondary
          />
        </div>
        <dl className="review">
          <div className="review-row">
            <dt>{content['facilities-review--selected-row-title']}</dt>
            <dd>{veteranSelectedFacility.name}</dd>
          </div>
          {hasAssignedFacility && (
            <div className="review-row">
              <dt>{content['facilities-review--assigned-row-title']}</dt>
              <dd>{selectedCaregiverSupportFacility.name}</dd>
            </div>
          )}
        </dl>
      </form>
    </div>
  );
};

FacilityReview.propTypes = {
  data: PropTypes.object,
  goToPath: PropTypes.func,
};

export default FacilityReview;
