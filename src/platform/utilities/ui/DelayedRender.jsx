import React from 'react';

class DelayedRender extends React.Component {
  static defaultProps = {
    threshold: 4000,
  };

  constructor(props) {
    super(props);
    this.state = {
      thresholdReached: false,
    };
  }

  componentDidMount() {
    this.timeoutId = setTimeout(() => {
      this.setState({ thresholdReached: true });
    }, this.props.threshold);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  render() {
    if (this.state.thresholdReached) {
      return this.props.children;
    }

    return null;
  }
}

export default DelayedRender;
