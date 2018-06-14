import React from 'react';
import PropTypes from 'prop-types';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import { toLower } from 'lodash';

import LoadingButton from './LoadingButton';

class FormActionButtons extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      deleteInitiated: false,
    };
  }

  cancelDeleteAction = () => {
    this.setState({ deleteInitiated: false });
  };

  confirmDeleteAction = (e) => {
    e.preventDefault();
    this.props.onDelete();
  };

  renderDeleteAction() {
    if (this.props.deleteEnabled) {
      return (
        <div className="right">
          <button className="usa-button-secondary button-link"
            onClick={() => this.setState({ deleteInitiated: true })}>
            <i className="fa fa-trash"></i> <span>Delete</span>
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
        <p>This will delete your {toLower(this.props.title)} across many VA records. You can always come back to your profile later if you'd like to add this information back in.</p>
        <div>
          <LoadingButton isLoading={this.props.isLoading} onClick={this.confirmDeleteAction}>Confirm</LoadingButton>
          <button type="button" className="usa-button-secondary" onClick={this.cancelDeleteAction}>Cancel</button>
        </div>
      </div>
    );

    if (this.state.deleteInitiated) {
      return (
        <AlertBox
          isVisible
          status="warning"
          content={alertContent}/>
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

FormActionButtons.propTypes = {
  deleteEnabled: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

FormActionButtons.defaultProps = {
  deleteEnabled: true,
};

export default FormActionButtons;
