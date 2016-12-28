import React from 'react';

class ButtonBack extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.context.router.push(this.props.url);
  }

  render() {
    return (
      <button
          className="msg-btn-back"
          onClick={this.onClick}>
        <i className="fa fa-chevron-left"></i>
        <span>Back</span>
      </button>
    );
  }
}

ButtonBack.contextTypes = {
  router: React.PropTypes.object.isRequired
};

ButtonBack.propTypes = {
  url: React.PropTypes.string.isRequired
};

export default ButtonBack;
