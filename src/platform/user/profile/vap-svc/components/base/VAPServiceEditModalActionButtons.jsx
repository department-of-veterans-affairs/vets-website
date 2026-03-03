import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { toLower } from 'lodash';

import recordEvent from 'platform/monitoring/record-event';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';

const VAPServiceEditModalActionButtons = ({
  analyticsSectionName,
  children,
  deleteEnabled = true,
  isLoading,
  onDelete,
  title,
}) => {
  const [deleteInitiated, setDeleteInitiated] = useState(false);
  const prevDeleteInitiated = useRef(false);

  useEffect(
    () => {
      // Once the va-alert is mounted, we want to set the focus to the heading
      // for screen reader use
      if (deleteInitiated && !prevDeleteInitiated.current) {
        const heading = document.getElementById('deleteConfirmationHeading');
        if (heading) {
          heading.focus();
        }
      }
      // If delete is cancelled, put focus back on modal close button
      if (!deleteInitiated && prevDeleteInitiated.current) {
        const closeButton = document.getElementsByClassName(
          'va-modal-close',
        )[0];
        if (closeButton) {
          closeButton.focus();
        }
      }
      prevDeleteInitiated.current = deleteInitiated;
    },
    [deleteInitiated],
  );

  const cancelDeleteAction = useCallback(
    () => {
      setDeleteInitiated(false);
      recordEvent({
        event: 'profile-navigation',
        'profile-action': 'cancel-delete-button',
        'profile-section': analyticsSectionName,
      });
    },
    [analyticsSectionName],
  );

  const confirmDeleteAction = useCallback(
    e => {
      e.preventDefault();
      recordEvent({
        event: 'profile-navigation',
        'profile-action': 'confirm-delete-button',
        'profile-section': analyticsSectionName,
      });
      onDelete();
    },
    [analyticsSectionName, onDelete],
  );

  const handleDeleteInitiated = useCallback(
    () => {
      recordEvent({
        event: 'profile-navigation',
        'profile-action': 'delete-button',
        'profile-section': analyticsSectionName,
      });
      setDeleteInitiated(true);
    },
    [analyticsSectionName],
  );

  const renderDeleteAction = () => {
    if (deleteEnabled) {
      return (
        <div className="right">
          <button
            className="usa-button-secondary button-link"
            onClick={handleDeleteInitiated}
          >
            <va-icon icon="delete" size={3} aria-hidden="true" />{' '}
            <span>Delete</span>
          </button>
        </div>
      );
    }

    return null;
  };

  const alertContent = (
    <div>
      <p>
        This will remove your {toLower(title)} across many VA records. You can
        always come back to your profile later if you’d like to add this
        information back in.
      </p>
      <div>
        <LoadingButton isLoading={isLoading} onClick={confirmDeleteAction}>
          Confirm
        </LoadingButton>
        <button
          type="button"
          className="usa-button-secondary"
          onClick={cancelDeleteAction}
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  if (deleteInitiated) {
    return (
      <va-alert visible status="warning">
        <h3 slot="headline">
          <span tabIndex="-1" id="deleteConfirmationHeading">
            Are you sure?
          </span>
        </h3>
        {alertContent}
      </va-alert>
    );
  }

  return (
    <div>
      {children}
      {renderDeleteAction()}
    </div>
  );
};

VAPServiceEditModalActionButtons.propTypes = {
  deleteEnabled: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default VAPServiceEditModalActionButtons;
