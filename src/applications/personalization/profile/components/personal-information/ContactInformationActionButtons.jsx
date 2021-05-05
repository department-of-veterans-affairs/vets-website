import React from 'react';
import PropTypes from 'prop-types';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';
import { toLower } from 'lodash';

import recordEvent from '~/platform/monitoring/record-event';
import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';
import { usePrevious } from '~/platform/utilities/react-hooks';

function AlertContent({ cancelAction, deleteAction, isLoading, title }) {
  return (
    <div>
      <p>
        This will delete your {toLower(title)} across many VA records. You can
        always come back to your profile later if you’d like to add this
        information back in.
      </p>
      <div>
        <LoadingButton isLoading={isLoading} onClick={deleteAction}>
          Confirm
        </LoadingButton>

        {!isLoading && (
          <button
            type="button"
            className="usa-button-secondary"
            onClick={cancelAction}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

function ContactInformationActionButtons(props) {
  const [deleteInitiated, setDeleteInitiated] = React.useState(false);
  const [focusDeleteAlert, setFocusDeleteAlert] = React.useState(false);
  const wasDeleteInitiated = usePrevious(deleteInitiated);

  React.useEffect(
    () => {
      if (deleteInitiated && !wasDeleteInitiated) {
        const heading = document.getElementById('deleteConfirmationHeading');
        if (heading) {
          heading.focus();
        }
      }
      if (!deleteInitiated && wasDeleteInitiated) {
        const closeButton = document.getElementsByClassName(
          'va-modal-close',
        )[0];
        if (closeButton) {
          closeButton.focus();
        }
      }
    },
    [deleteInitiated, wasDeleteInitiated],
  );

  React.useEffect(
    () => {
      if (focusDeleteAlert) {
        setFocusDeleteAlert(false);
      }
    },
    [focusDeleteAlert, setFocusDeleteAlert],
  );

  const cancelDeleteAction = () => {
    setDeleteInitiated(false);
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'cancel-delete-button',
      'profile-section': props.analyticsSectionName,
    });
  };

  const confirmDeleteAction = e => {
    e.preventDefault();
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'confirm-delete-button',
      'profile-section': props.analyticsSectionName,
    });
    props.onDelete();
  };

  const handleDeleteInitiated = () => {
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'delete-button',
      'profile-section': props.analyticsSectionName,
    });
    setDeleteInitiated(true);
    setFocusDeleteAlert(true);
  };

  const renderDeleteAction = () => {
    if (props.deleteEnabled) {
      return (
        <button
          type="button"
          className="va-button-link vads-u-margin-top--1p5"
          onClick={handleDeleteInitiated}
        >
          Remove {toLower(props.title)}
        </button>
      );
    }

    return null;
  };

  if (deleteInitiated) {
    return (
      <AlertBox
        content={
          <AlertContent
            cancelAction={cancelDeleteAction}
            deleteAction={confirmDeleteAction}
            isLoading={props.isLoading}
            title={props.title}
          />
        }
        headline={
          <span tabIndex="-1" id="deleteConfirmationHeading">
            Are you sure?
          </span>
        }
        isVisible
        scrollOnShow={focusDeleteAlert}
        scrollPosition="end"
        status={ALERT_TYPE.WARNING}
      />
    );
  }

  return (
    <div className="vads-u-display--flex vads-u-flex-wrap--wrap vads-u-flex-direction--column">
      {props.children}
      {renderDeleteAction()}
    </div>
  );
}

ContactInformationActionButtons.propTypes = {
  deleteEnabled: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

ContactInformationActionButtons.defaultProps = {
  deleteEnabled: true,
};

export default ContactInformationActionButtons;
