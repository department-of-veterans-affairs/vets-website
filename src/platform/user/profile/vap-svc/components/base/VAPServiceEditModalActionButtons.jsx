import React from 'react';
import PropTypes from 'prop-types';
import { toLower } from 'lodash';

import recordEvent from 'platform/monitoring/record-event';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';

class VAPServiceEditModalActionButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deleteInitiated: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // Once the va-alert is mounted, we want to set the focus to the heading
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
        <div className="right">
          <button
            className="usa-button-secondary button-link"
            onClick={this.handleDeleteInitiated}
          >
            <va-icon icon="delete" size={3} aria-hidden="true" />{' '}
            <span>Delete</span>
          </button>
        </div>
      );
    }

    return null;
  }

  render() {
    const alertContent = (
      <div>
        <p>
          This will remove your {toLower(this.props.title)} across many VA
          records. You can always come back to your profile later if you’d like
          to add this information back in.
        </p>
        <div>
          <LoadingButton
            isLoading={this.props.isLoading}
            onClick={this.confirmDeleteAction}
          >
            Confirm
          </LoadingButton>
          <button
            type="button"
            className="usa-button-secondary"
            onClick={this.cancelDeleteAction}
            disabled={this.props.isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    );

    if (this.state.deleteInitiated) {
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
        {this.props.children}
        {this.renderDeleteAction()}
      </div>
    );
  }
}

VAPServiceEditModalActionButtons.propTypes = {
  deleteEnabled: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

VAPServiceEditModalActionButtons.defaultProps = {
  deleteEnabled: true,
};

export default VAPServiceEditModalActionButtons;
