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
        <button
            type="button"
            disabled={!this.props.onClickPrev}
            onClick={this.props.onClickPrev}>
          <i className="fa fa-chevron-left"></i>
          <span>Previous</span>
        </button>
        <button
            type="button"
            disabled={!this.props.onClickNext}
            onClick={this.props.onClickNext}>
          <span>Next</span>
          <i className="fa fa-chevron-right"></i>
        </button>
      </div>
    );
  }
}

MessageNav.propTypes = {
  currentRange: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string
  ]).isRequired,
  messageCount: React.PropTypes.number.isRequired,
  onClickPrev: React.PropTypes.func,
  onClickNext: React.PropTypes.func
};

export default MessageNav;
