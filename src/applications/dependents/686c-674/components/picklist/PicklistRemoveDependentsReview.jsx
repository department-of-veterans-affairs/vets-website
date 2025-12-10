import React from 'react';
import PropTypes from 'prop-types';

import { getFullName } from '../../../shared/utils';

import {
  PICKLIST_DATA,
  PICKLIST_EDIT_REVIEW_FLAG,
} from '../../config/constants';

/**
 * Picklist Remove Dependents Review Component
 * @typedef {object} PicklistRemoveDependentsReviewProps
 * @property {object} data - form data
 * @property {function} goToPath - function to go to specific path
 *
 * @param {PicklistRemoveDependentsReviewProps} props - Component props
 * @returns {React.Component} - Picklist remove dependents review page
 */
const PicklistRemoveDependentsReview = ({ data = {}, goToPath }) => {
  const selectedDependents =
    data[PICKLIST_DATA]?.filter(item => item.selected) || [];

  const handlers = {
    onEdit: event => {
      event.preventDefault();
      // Go to picklist page, but we'll force them to navigate through all the
      // followup pages again
      sessionStorage.removeItem(PICKLIST_EDIT_REVIEW_FLAG);
      goToPath('/options-selection/remove-active-dependents');
    },
  };

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row vads-u-margin-bottom--2">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          Dependents you would like to remove
        </h4>
        <va-button
          secondary
          class="edit-page float-right"
          onClick={handlers.onEdit}
          label="Edit dependents you want to remove"
          text="Edit"
        />
      </div>

      {selectedDependents.length === 0 && (
        <p className="usa-input-error-message">
          No dependents selected for removal.
        </p>
      )}

      {selectedDependents.map(item => {
        const dependentFullName = getFullName(item.fullName);
        return (
          <va-card key={item.key} class="vads-u-margin-bottom--2">
            <div
              className="dd-privacy-mask"
              data-dd-action-name="dependent info"
            >
              <h5 className="vads-u-margin--0">{dependentFullName}</h5>
              <div>
                {item.relationshipToVeteran}, {item.labeledAge}
              </div>
            </div>
          </va-card>
        );
      })}
    </div>
  );
};

PicklistRemoveDependentsReview.propTypes = {
  data: PropTypes.object.isRequired,
  goToPath: PropTypes.func,
};

export default PicklistRemoveDependentsReview;
