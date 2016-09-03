import React from 'react';

class SubmitButton extends React.Component {
  render() {
    return (
      <button className={`usa-button-outline ${this.props.cssClass}`}
          type="submit">{this.props.text}</button>
    );
  }
}

SubmitButton.propTypes = {
  cssClass: React.PropTypes.string,
  text: React.PropTypes.string,
};

export default SubmitButton;
