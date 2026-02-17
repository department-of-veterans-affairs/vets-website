import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollAndFocus } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import { getFullName, makeNamePossessive } from '../../../shared/utils';

import {
  PICKLIST_DATA,
  PICKLIST_EDIT_REVIEW_FLAG,
} from '../../config/constants';
import { routing } from './routes';
import { pageDetails } from './utils';

/**
 * Picklist Remove Dependents Followup Review Component
 * @typedef {object} PicklistRemoveDependentFollowupReviewProps
 * @property {object} data - form data
 * @property {function} goToPath - function to go to specific path
 *
 * @param {PicklistRemoveDependentFollowupReviewProps} props - Component props
 * @returns {React.Component} - Picklist remove dependents followup review page
 */
const PicklistRemoveDependentsFollowupReview = ({ data = {}, goToPath }) => {
  const updatedAlertRef = useRef(null);
  const selectedDependents =
    data[PICKLIST_DATA]?.filter(item => item.selected) || [];
  const updatedKey = sessionStorage.getItem(PICKLIST_EDIT_REVIEW_FLAG) || false;
  const [showUpdatedAlert, setShowUpdatedAlert] = useState(updatedKey);

  useEffect(() => {
    if (updatedKey && updatedAlertRef.current) {
      // Delay focus to wait out review page focus on the page title header
      setTimeout(() => {
        scrollAndFocus(updatedAlertRef.current);
      }, 300);
    }
  }, [updatedKey, updatedAlertRef]);

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
    onCloseAlert: () => {
      sessionStorage.removeItem(PICKLIST_EDIT_REVIEW_FLAG);
      const el = $(`va-button[data-key="${showUpdatedAlert}"]`);
      if (el) {
        focusElement('button', {}, el?.shadowRoot);
      }
      setShowUpdatedAlert(false);
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
            {showUpdatedAlert && item.key === updatedKey && (
              <div className="vads-u-margin-bottom--1 vads-u-margin-right--0p5">
                <VaAlert
                  ref={updatedAlertRef}
                  slim
                  closeable
                  id="updated-dependent-alert"
                  status="success"
                  close-btn-aria-label="Close notification"
                  onCloseEvent={handlers.onCloseAlert}
                >
                  <div
                    className="dd-privacy-mask"
                    data-dd-action-name="Successfully updated alert"
                  >
                    {`${makeNamePossessive(
                      dependentFullName,
                    )} information has been updated`}
                  </div>
                </VaAlert>
              </div>
            )}
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
