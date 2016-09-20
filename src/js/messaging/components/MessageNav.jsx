import React from 'react';

class MessageNav extends React.Component {
  render() {
    return (
      <div className="messaging-message-nav">
        <span className="messaging-count">
          <b>{this.props.currentRange}</b>
          &nbsp;of&nbsp;
          <b>{this.props.messageCount}</b>
        </span>
        <button type="button" onClick={this.props.handlePrev}>
          <i className="fa fa-chevron-left"></i>
          <span>Previous</span>
        </button>
        <button type="button" onClick={this.props.handleNext}>
          <span>Next</span>
          <i className="fa fa-chevron-right"></i>
        </button>
      </div>
    );
  }
}

MessageNav.propTypes = {
  currentRange: React.PropTypes.string.isRequired,
  messageCount: React.PropTypes.number.isRequired,
  handlePrev: React.PropTypes.func,
  handleNext: React.PropTypes.func
};

export default MessageNav;
