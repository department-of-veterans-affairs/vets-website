import React from 'react';
import PropTypes from 'prop-types';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/formation-react/AlertBox';
import { toLower } from 'lodash';

import recordEvent from '~/platform/monitoring/record-event';
import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';

class ContactInformationActionButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deleteInitiated: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // Once the AlertBox is mounted, we want to set the focus to the heading
    // for screen reader use
    if (this.state.deleteInitiated && !prevState.deleteInitiated) {
      const heading = document.getElementById('deleteConfirmationHeading');
      if (heading) {
        heading.focus();
      }
    }
    // If delete is cancelled, put focus back on modal close button
    if (!this.state.deleteInitiated && prevState.deleteInitiated) {
      const closeButton = document.getElementsByClassName('va-modal-close')[0];
      if (closeButton) {
        closeButton.focus();
      }
    }
  }

  cancelDeleteAction = () => {
    this.setState({ deleteInitiated: false });
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'cancel-delete-button',
      'profile-section': this.props.analyticsSectionName,
    });
  };

  confirmDeleteAction = e => {
    e.preventDefault();
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'confirm-delete-button',
      'profile-section': this.props.analyticsSectionName,
    });
    this.props.onDelete();
  };

  handleDeleteInitiated = () => {
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'delete-button',
      'profile-section': this.props.analyticsSectionName,
    });
    this.setState({ deleteInitiated: true });
  };

  renderDeleteAction() {
    if (this.props.deleteEnabled) {
      return (
        <button
          type="button"
          className="va-button-link vads-u-margin-top--1p5"
          onClick={this.handleDeleteInitiated}
        >
          Remove {toLower(this.props.title)}
        </button>
      );
    }

    return null;
  }

  render() {
    const alertContent = (
      <div>
        <p>
          This will delete your {toLower(this.props.title)} across many VA
          records. You can always come back to your profile later if you'd like
          to add this information back in.
        </p>
        <div>
          <LoadingButton
            isLoading={this.props.isLoading}
            onClick={this.confirmDeleteAction}
          >
            Confirm
          </LoadingButton>

          {!this.props.isLoading && (
            <button
              type="button"
              className="usa-button-secondary"
              onClick={this.cancelDeleteAction}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );

    if (this.state.deleteInitiated) {
      return (
        <AlertBox
          content={alertContent}
          headline={
            <span tabIndex="-1" id="deleteConfirmationHeading">
              Are you sure?
            </span>
          }
          isVisible
          scrollOnShow
          scrollPosition="end"
          status={ALERT_TYPE.WARNING}
        />
      );
    }

    return (
      <div className="vads-u-display--flex vads-u-flex-wrap--wrap vads-u-flex-direction--column">
        {this.props.children}
        {this.renderDeleteAction()}
      </div>
    );
  }
}

ContactInformationActionButtons.propTypes = {
  deleteEnabled: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

ContactInformationActionButtons.defaultProps = {
  deleteEnabled: true,
};

export default ContactInformationActionButtons;
