import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

class TimedAlertBox extends React.Component {
  state = {
    isVisible: this.props.startTimer,
  };

  componentDidMount() {
    if (this.props.startTimer) {
      if (this.intervalId === undefined) {
        this.intervalId = setInterval(this.clearAlert, this.props.interval);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  clearAlert = () => {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
    this.setState({ isVisible: false });
  };

  render() {
    return (
      <div>
        <AlertBox
          isVisible={this.state.isVisible}
          content={this.props.content}
          status={this.props.status}
          backgroundOnly
        />
      </div>
    );
  }
}

export default TimedAlertBox;
