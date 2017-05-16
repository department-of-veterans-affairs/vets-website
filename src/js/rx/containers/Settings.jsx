import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import AlertBox from '../../common/components/AlertBox';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';
import { makeField } from '../../common/model/fields';

import { closeAlert } from '../actions/alert';

import {
  fetchPreferences,
  savePreferences,
  setNotificationEmail,
  setNotificationFlag
} from '../actions/preferences';

import DiscardChangesModal from '../components/DiscardChangesModal';
import SettingsButton from '../components/SettingsButton';

export class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderSaveButtons = this.renderSaveButtons.bind(this);

    this.state = { discardChanges: false };
  }

  componentDidMount() {
    this.props.fetchPreferences();
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email, flag } = this.props;
    this.props.savePreferences({
      emailAddress: email.value,
      rxFlag: flag.value === 'true'
    });
    window.dataLayer.push({
      event: 'rx-notification-setting',
      'rx-notify': flag.value,
    });
  }

  renderSaveButtons() {
    const { email, flag } = this.props;
    const isSaveable = email.dirty || flag.dirty;

    const saveButtonClass = classNames(
      'usa-button',
      { 'usa-button-disabled': !isSaveable }
    );

    return (
      <div className="rx-notifications-save">
        <button
            className={saveButtonClass}
            disabled={!isSaveable}>
          Save changes
        </button>
        {
          isSaveable &&
          (<button
              className="usa-button-outline"
              type="button"
              onClick={() => this.setState({ discardChanges: true })}>
            Cancel
          </button>)
        }
      </div>
    );
  }

  render() {
    const { isLoading, isSaving } = this.props;

    if (isLoading) {
      return (
        <div id="rx-settings">
          <LoadingIndicator message="Loading preferences..."/>
        </div>
      );
    }

    if (isSaving) {
      return (
        <div id="rx-settings">
          <LoadingIndicator message="Saving preferences..."/>
        </div>
      );
    }

    const { alert, email, flag } = this.props;

    return (
      <div id="rx-settings">
        <AlertBox
            content={alert.content}
            isVisible={alert.visible}
            onCloseAlert={this.props.closeAlert}
            scrollOnShow
            status={alert.status}/>
        <div className="rx-app-title">
          <h1>Settings</h1>
          <SettingsButton/>
        </div>
        <div>
          Receive email notifications of when your prescriptions ship.
        </div>
        <form onSubmit={this.handleSubmit}>
          <ErrorableRadioButtons
              name="notifications"
              label="Prescription refill shipment notification:"
              options={[
                { label: 'On', value: 'true' },
                { label: 'Off', value: 'false' }
              ]}
              onValueChange={v => this.props.setNotificationFlag(v)}
              value={flag}/>
          <ErrorableTextInput
              name="email"
              label="Send email notifications to:"
              onValueChange={({ value }) =>
                this.props.setNotificationEmail(makeField(value, true))
              }
              field={email}/>
          {this.renderSaveButtons()}
        </form>
        <DiscardChangesModal
            onClose={() => this.setState({ discardChanges: false })}
            onSubmit={this.props.fetchPreferences}
            visible={this.state.discardChanges}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const rxState = state.health.rx;
  const { email, flag, loading, saving } = rxState.preferences;
  return {
    alert: rxState.alert,
    email,
    flag,
    isLoading: loading,
    isSaving: saving
  };
};

const mapDispatchToProps = {
  closeAlert,
  fetchPreferences,
  savePreferences,
  setNotificationEmail,
  setNotificationFlag
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
