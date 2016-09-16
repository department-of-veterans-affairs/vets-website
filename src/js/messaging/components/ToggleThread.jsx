import React from 'react';

class ToggleThread extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
  }

  render() {
    return (
      <button
          className="messaging-toggle-thread"
          type="button"
          onClick={this.handleClick}>
        <i className="fa fa-chevron-down"></i>
        <span>Expand all</span>
      </button>
    );
  }
}

ToggleThread.propTypes = {
};

export default ToggleThread;
