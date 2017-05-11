import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';

import {
  fetchPreferences,
  savePreferences,
  setNotificationEmail,
  setNotificationFlag
} from '../actions/preferences';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderSaveButtons = this.renderSaveButtons.bind(this);
  }

  componentDidMount() {
    this.props.fetchPreferences();
  }

  handleSubmit(e) {
    e.preventDefault();
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
              onClick={() => {}}>
            Cancel
          </button>)
        }
      </div>
    );
  }

  render() {
    const { email, flag } = this.props;

    return (
      <div id="rx-settings">
        <h1>Settings</h1>
        <p className="rx-tab-explainer">
          Receive email notifications of when your prescriptions ship.
        </p>
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
              onValueChange={v => this.props.setNotificationEmail(v)}
              field={email}/>
          {this.renderSaveButtons()}
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const rxState = state.health.rx;
  const { email, flag } = rxState.preferences;
  return { email, flag };
};

const mapDispatchToProps = {
  fetchPreferences,
  savePreferences,
  setNotificationEmail,
  setNotificationFlag
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
