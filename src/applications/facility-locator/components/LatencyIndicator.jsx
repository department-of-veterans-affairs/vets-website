import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

class LatencyIndicator extends React.Component {
  static defaultProps = {
    latencyThreshold: 2000,
  };

  constructor(props) {
    super(props);
    this.state = {
      sufferingLatency: false,
    };
  }

  componentDidMount() {
    this.timeoutId = setTimeout(() => {
      this.setState({ sufferingLatency: true });
    }, this.props.latencyThreshold);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  render() {
    return (
      <AlertBox
        isVisible={this.state.sufferingLatency}
        status="info"
        headline="Please wait"
        content="Your results should appear in less than a minute. Thank you for your patience."
      />
    );
  }
}

export default LatencyIndicator;
