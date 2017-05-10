import React from 'react';
import { connect } from 'react-redux';

import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';
import { makeField } from '../../common/model/fields';

import {
  fetchPreferences,
  savePreferences,
  setNotificationEmail,
  setNotificationFrequency
} from '../actions';

export class EmailNotifications extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchPreferences();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {
      emailAddress: { value: emailAddress },
      frequency: { value: frequency }
    } = this.props;
    this.props.savePreferences({ emailAddress, frequency });
  }

  render() {
    const { emailAddress, frequency } = this.props;
    const isNotified = ['each_message', 'daily'].includes(frequency.value);
    const isSaveable = emailAddress.dirty || frequency.dirty;

    return (
      <div className="va-tab-content">
        <div>
          Receive email notifications of of the arrival of new messages.
        </div>
        <form onSubmit={this.handleSubmit}>
          <label>New message email notification:</label>
          <div className="msg-notifications-inputs">
            <div>
              <input
                  id="notifications-on"
                  type="radio"
                  value="on"
                  checked={isNotified}
                  onChange={() => this.props.setNotificationFrequency(
                    makeField('each_message', true)
                  )}/>
              <label htmlFor="notifications-on">On</label>
              {
                isNotified && <div className="form-expanding-group-open">
                  <ErrorableRadioButtons
                      name="frequency"
                      label=""
                      options={[
                        { label: 'Each message', value: 'each_message' },
                        { label: 'Once a day', value: 'daily' }
                      ]}
                      onValueChange={v => this.props.setNotificationFrequency(v)}
                      value={frequency}/>
                </div>
              }
            </div>
            <div>
              <input
                  id="notifications-off"
                  type="radio"
                  value="off"
                  checked={!isNotified}
                  onChange={() => this.props.setNotificationFrequency(
                    makeField('none', true)
                  )}/>
              <label htmlFor="notifications-off">Off</label>
            </div>
          </div>
          <ErrorableTextInput
              name="emailAddress"
              label="Send email notifications to:"
              onValueChange={v => this.props.setNotificationEmail(v)}
              field={emailAddress}/>
          <div className="msg-notifications-save">
            <button disabled={!isSaveable}>Save changes</button>
            {
              isSaveable &&
              (<button className="usa-button-outline">
                Cancel
              </button>)
            }
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const msgState = state.health.msg;
  return msgState.preferences;
};

const mapDispatchToProps = {
  fetchPreferences,
  savePreferences,
  setNotificationEmail,
  setNotificationFrequency
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailNotifications);
