import React from 'react';

class MessageFrom extends React.Component {
  render() {
    return (
      <div className={this.props.cssClass}>
        <b className={`${this.props.cssClass}-label`}>From: </b>
        {`${this.props.lastName}, ${this.props.firstName} ${this.props.middleName}`}
      </div>
    );
  }
}

MessageFrom.propTypes = {
  cssClass: React.PropTypes.string,
  firstName: React.PropTypes.string.isRequired,
  lastName: React.PropTypes.string.isRequired,
  middleName: React.PropTypes.string
};

export default MessageFrom;
