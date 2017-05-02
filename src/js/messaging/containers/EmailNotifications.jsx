import React from 'react';
import { connect } from 'react-redux';

import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';

export class EmailNotifications extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      notifications: 'on',
      frequency: 'each',
      email: 'brian.williams@gmail.com'
    };
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
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
                  checked={this.state.notifications === 'on'}
                  onChange={() => this.setState({ notifications: 'on' })}/>
              <label htmlFor="notifications-on">On</label>
              {
                this.state.notifications === 'on' && <div className="form-expanding-group-open">
                  <ErrorableRadioButtons
                      name="frequency"
                      label=""
                      options={[
                        { label: 'Each message', value: 'each' },
                        { label: 'Once a day', value: 'daily' }
                      ]}
                      onValueChange={v => this.setState({ frequency: v.value })}
                      value={{ value: this.state.frequency }}/>
                </div>
              }
            </div>
            <div>
              <input
                  id="notifications-off"
                  type="radio"
                  value="off"
                  checked={this.state.notifications === 'off'}
                  onChange={() => this.setState({ notifications: 'off' })}/>
              <label htmlFor="notifications-off">Off</label>
            </div>
          </div>
          <ErrorableTextInput
              name="email"
              label="Send email notifications to:"
              onValueChange={v => this.setState({ email: v.value })}
              field={{ value: this.state.email }}/>
          <button className="msg-btn-notifications">
            Save changes
          </button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = {};

export default connect(null, mapDispatchToProps)(EmailNotifications);
