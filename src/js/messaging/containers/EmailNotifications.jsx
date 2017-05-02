import React from 'react';
import { connect } from 'react-redux';

import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';

export class EmailNotifications extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      notifications: 'each',
      email: 'brian.williams@gmail.com'
    };
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    return (
      <div className="va-tab-content">
        <p>
          Receive email notifications of of the arrival of new messages.
        </p>
        <form onSubmit={this.handleSubmit}>
          <ErrorableRadioButtons
              name="notifications"
              label="New message email notification:"
              options={[
                { label: 'On', value: 'on' },
                { label: 'Off', value: 'off' }
              ]}
              onValueChange={v => this.setState({ notifications: v.value })}
              value={{ value: this.state.notifications }}/>
          <ErrorableTextInput
              name="email"
              label="Send email notifications to:"
              onValueChange={v => this.setState({ email: v.value })}
              field={{ value: this.state.email }}/>
          <button>Save changes</button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = {};

export default connect(null, mapDispatchToProps)(EmailNotifications);
