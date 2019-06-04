import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

class LatencyIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sufferingLatency: false,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ sufferingLatency: true });
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    if (!this.state.sufferingLatency) {
      return null;
    }

    return (
      <AlertBox
        isVisible={this.state.sufferingLatency}
        status="info"
        headline="Unexpected wait"
      >
        <p>Please wait, results may take a few seconds longer than normal</p>
      </AlertBox>
    );
  }
}

export default LatencyIndicator;
