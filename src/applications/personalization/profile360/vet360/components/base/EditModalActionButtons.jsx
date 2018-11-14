import React from 'react';
import PropTypes from 'prop-types';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import { toLower } from 'lodash';

import recordEvent from '../../../../../../platform/monitoring/record-event';
import LoadingButton from './LoadingButton';

class Vet360EditModalActionButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deleteInitiated: false,
    };
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
            <i className="fa fa-trash" /> <span>Delete</span>
          </button>
        </div>
      );
    }

    return null;
  }

  render() {
    const alertContent = (
      <div>
        <h3>Are you sure?</h3>
        <p>
          This will delete your {toLower(this.props.title)} across many VA
          records. You can always come back to your profile later if you'd like
          to add this information back in.
        </p>
        <div>
          <LoadingButton
            isLoading={
              this.props.transactionRequest &&
              this.props.transactionRequest.isPending
            }
            onClick={this.confirmDeleteAction}
          >
            Confirm
          </LoadingButton>
          <button
            type="button"
            className="usa-button-secondary"
            onClick={this.cancelDeleteAction}
          >
            Cancel
          </button>
        </div>
      </div>
    );

    if (this.state.deleteInitiated) {
      return <AlertBox isVisible status="warning" content={alertContent} />;
    }

    return (
      <div>
        {this.props.children}
        {this.renderDeleteAction()}
      </div>
    );
  }
}

Vet360EditModalActionButtons.propTypes = {
  deleteEnabled: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  transactionRequest: PropTypes.object,
};

Vet360EditModalActionButtons.defaultProps = {
  deleteEnabled: true,
};

export default Vet360EditModalActionButtons;
