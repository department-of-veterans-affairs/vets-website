import React from 'react';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export class AppDeletedAlert extends React.Component {
  componentDidMount() {
    this.alert.focus();
  }

  alertMessage() {
    // eslint-disable-next-line prettier/prettier
    return `${this.props.account.attributes.title} has been disconnected from your account.`;
  }

  render() {
    return (
      <div
        tabIndex="-1"
        ref={alert => {
          this.alert = alert;
        }}
      >
        <AlertBox
          status="success"
          headline="Account Disconnected"
          content={this.alertMessage()}
          onCloseAlert={() => this.props.dismissAlert(this.props.account.id)}
        />
      </div>
    );
  }
}
