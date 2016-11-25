import React from 'react';

export default class LoadingIndicator extends React.Component {
  componentDidMount() {
    if (this.props.setFocus) {
      this.spinnerDiv.focus();
    }
  }
  render() {
    const message = this.props.message;

    return (
      <div className="loading-indicator-container">
        <div
            ref={(div) => { this.spinnerDiv = div; }}
            className="loading-indicator"
            role="progressbar"
            aria-valuetext={message}
            tabIndex="0"></div>
        {message}
      </div>
    );
  }
}

LoadingIndicator.propTypes = {
  message: React.PropTypes.string.isRequired,
  setFocus: React.PropTypes.bool
};

LoadingIndicator.defaultProps = {
  setFocus: false
};
