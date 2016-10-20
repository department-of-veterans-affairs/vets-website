import React from 'react';

class MessageNav extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickNext = this.handleClickNext.bind(this);
    this.handleClickPrev = this.handleClickPrev.bind(this);
  }

  handleClickNext() {
    if (this.props.itemNumber < this.props.totalItems) {
      this.props.onItemSelect(this.props.itemNumber + 1);
    }
  }

  handleClickPrev() {
    if (this.props.itemNumber > 1) {
      this.props.onItemSelect(this.props.itemNumber - 1);
    }
  }

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
            disabled={this.props.itemNumber <= 1}
            onClick={this.handleClickPrev}>
          <i className="fa fa-chevron-left"></i>
          <span>Previous</span>
        </button>
        <button
            type="button"
            disabled={this.props.itemNumber >= this.props.totalItems}
            onClick={this.handleClickNext}>
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
  onItemSelect: React.PropTypes.func,
  itemNumber: React.PropTypes.number.isRequired,
  totalItems: React.PropTypes.number.isRequired
};

export default MessageNav;
