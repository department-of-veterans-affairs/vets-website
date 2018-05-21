import React from 'react';
import Modal from '@department-of-veterans-affairs/formation/Modal';
import serviceStatus from '../config/serviceStatus';
import dismissedDowntimeNotifications from '../util/dismissedDowntimeNotifications';
import DowntimeNotificationWrapper from './Wrapper';

export default class DowntimeApproaching extends React.Component {
  constructor(props) {
    super(props);
    dismissedDowntimeNotifications.setup();
    this.state = {
      modalDismissed: dismissedDowntimeNotifications.contains(props.appTitle),
      cache: {}
    };
  }

  dismissModal = () => {
    dismissedDowntimeNotifications.push(this.props.appTitle);
    this.setState({ modalDismissed: true });
  }

  render() {
    const {
      startTime,
      endTime,
      appTitle,
      children,
      content
    } = this.props;

    let downtimeNotification = null;
    if (!this.state.modalDismissed) {
      downtimeNotification = (
        <Modal id="downtime-approaching-modal"
          onClose={this.dismissModal}
          visible={!this.state.modalDismissed}>
          <h3>The {appTitle} will be down for maintenance soon</h3>
          <p>We’ll be doing some work on the {appTitle} on {startTime.format('MMMM Do')} between {startTime.format('LT')} and {endTime.format('LT')} If you have trouble using this tool during that time, please check back soon.</p>
          <button type="button" className="usa-button-secondary" onClick={this.dismissModal}>Dismiss</button>
        </Modal>);
    }
    return (
      <DowntimeNotificationWrapper status={serviceStatus.downtimeApproaching}>
        {downtimeNotification}
        {children || content}
      </DowntimeNotificationWrapper>
    );
  }

}
