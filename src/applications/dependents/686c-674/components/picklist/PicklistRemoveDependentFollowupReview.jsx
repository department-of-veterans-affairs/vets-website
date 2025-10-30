import React from 'react';
import PropTypes from 'prop-types';

import { getFullName } from '../../../shared/utils';

import {
  PICKLIST_DATA,
  PICKLIST_EDIT_REVIEW_FLAG,
} from '../../config/constants';
import { routing } from './routes';
import { pageDetails } from './utils';

const PicklistRemoveDependentsFollowupReview = ({ data = {}, goToPath }) => {
  const selectedDependents =
    data[PICKLIST_DATA]?.filter(item => item.selected) || [];

  const handlers = {
    onEdit: event => {
      event.preventDefault();
      const { target } = event;
      const key = target.getAttribute('data-key');
      const type = target.getAttribute('data-type');
      const path = routing[type][0]?.path || '';
      const index = data[PICKLIST_DATA].findIndex(item => item.key === key);

      if (path && index > -1) {
        sessionStorage.setItem(PICKLIST_EDIT_REVIEW_FLAG, key);
        goToPath(`/remove-dependent?index=${index}&page=${path}`);
      }
    },
  };

  // The entire accordion is hidden if there aren't any selected dependents
  if (selectedDependents.length === 0) {
    return null;
  }

  return (
    <>
      {selectedDependents.map(item => {
        const dependentFullName = getFullName(item.fullName);
        const details = pageDetails[item.relationshipToVeteran](item);
        return (
          <div key={item.key} className="form-review-panel-page">
            <div className="form-review-panel-page-header-row vads-u-margin-bottom--2">
              <h4
                className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0 dd-privacy-mask"
                data-dd-action-name="dependent name"
              >
                {`${dependentFullName} (${item.labeledAge})`}
              </h4>
              <va-button
                secondary
                class="edit-page float-right"
                data-key={item.key}
                data-type={item.relationshipToVeteran}
                onClick={handlers.onEdit}
                label={`Edit details for ${dependentFullName}`}
                text="Edit"
              />
            </div>

            <dl className="review">
              {details
                .filter(Boolean)
                .map(
                  ({ label, value, hideLabel, hideValue = true, action }) => (
                    <div className="review-row" key={label}>
                      <dt
                        className={hideLabel ? 'dd-privacy-hidden' : ''}
                        data-dd-action-name={action || label}
                      >
                        {label}
                      </dt>
                      <dd
                        className={hideValue ? 'dd-privacy-hidden' : ''}
                        data-dd-action-name={action || label}
                      >
                        <strong>{value}</strong>
                      </dd>
                    </div>
                  ),
                )}
            </dl>
          </div>
        );
      })}
    </>
  );
};

PicklistRemoveDependentsFollowupReview.propTypes = {
  data: PropTypes.object.isRequired,
  goToPath: PropTypes.func,
};

export default PicklistRemoveDependentsFollowupReview;
