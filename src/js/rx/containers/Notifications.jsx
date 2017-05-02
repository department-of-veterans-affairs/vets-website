import React from 'react';
import { connect } from 'react-redux';

import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      notifications: 'on',
      email: 'brian.williams@gmail.com'
    };
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    return (
      <div id="rx-notifications" className="va-tab-content">
        <p className="rx-tab-explainer">
          Receive email notifications of when your prescriptions ship.
        </p>
        <form onSubmit={this.handleSubmit}>
          <ErrorableRadioButtons
              name="notifications"
              label="Prescription refill shipment notification:"
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

const mapStateToProps = (state) => {
  const { email } = state.user.profile;
  return { email };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
