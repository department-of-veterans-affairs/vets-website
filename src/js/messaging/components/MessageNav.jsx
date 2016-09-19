import React from 'react';

class MessageNav extends React.Component {
  goToPrevious() {
  }

  goToNext() {
  }

  render() {
    return (
      <div className="messaging-nav">
        <span className="messaging-count">
          {this.props.current} of {this.props.total}
        </span>
        <button type="button">
          <i className="fa fa-chevron-left"></i>
          Previous
        </button>
        <button type="button">
          <i className="fa fa-chevron-right"></i>
          Next
        </button>
      </div>
    );
  }
}

MessageNav.propTypes = {
  currentMessage: React.PropTypes.number.isRequired,
  messageCount: React.PropTypes.number.isRequired
};

export default MessageNav;
