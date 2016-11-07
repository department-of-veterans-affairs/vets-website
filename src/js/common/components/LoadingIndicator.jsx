import React from 'react';

export default class LoadingIndicator extends React.Component {
  componentDidMount() {
    if (this.props.setFocus) {
      document.querySelector('.loading-indicator').focus();
    }
  }
  render() {
    const { message, screenReaderMessage } = this.props;

    return (
      <div className="loading-indicator-container">
        <div className="loading-indicator" role="progressbar" aria-valuetext={message || screenReaderMessage} tabIndex="0"></div>
        {message}
      </div>
    );
  }
}

LoadingIndicator.propTypes = {
  message: React.PropTypes.string,
  screenReaderMessage: React.PropTypes.string,
  setFocus: React.PropTypes.bool
};

LoadingIndicator.defaultProps = {
  screenReaderMessage: 'Loading',
  setFocus: false
};
