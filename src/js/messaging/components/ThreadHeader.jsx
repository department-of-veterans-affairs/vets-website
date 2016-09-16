import React from 'react';

class ThreadHeader extends React.Component {
  render() {
    return (
      <div>
        <h2 className="messaging-thread-name">{this.props.title}</h2>
      </div>
    );
  }
}

ThreadHeader.propTypes = {
  title: React.PropTypes.string.isRequired
};

export default ThreadHeader;
