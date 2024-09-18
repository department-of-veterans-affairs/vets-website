import React from 'react';
import PropTypes from 'prop-types';
import content from '../../locales/en/content.json';

const FacilityReview = props => {
  const { data, goToPath } = props;
  const plannedClinic = data['view:plannedClinic'];
  const veteranSelectedFacility = plannedClinic.veteranSelected;
  const selectedCaregiverSupportFacility = plannedClinic.caregiverSupport;
  const hasAssignedFacility =
    veteranSelectedFacility?.id !== selectedCaregiverSupportFacility?.id;

  return (
    <div className="form-review-panel-page">
      <form className="rjsf" noValidate="">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            {content['vet-med-center-search-description']}
          </h4>
          <va-button
            text="Edit"
            label="Edit facility"
            onClick={() =>
              goToPath(
                '/veteran-information/va-medical-center/locator?review=true',
              )
            }
            secondary
            uswds
          />
        </div>
        <dl className="review">
          <div className="review-row">
            <dt>The Veteran’s facility you selected</dt>
            <dd>{veteranSelectedFacility.name}</dd>
          </div>
          {hasAssignedFacility && (
            <div className="review-row">
              <dt>Your assigned caregiver support facility</dt>
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
