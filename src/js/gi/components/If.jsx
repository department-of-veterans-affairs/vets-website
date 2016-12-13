import React from 'react';

class If extends React.Component {

  render() {
    if (!!this.props.condition) {
      return this.props.children;
    }
    return null;
  }

}

If.propTypes = {
  condition: React.PropTypes.bool.isRequired
};

If.defaultProps = {
  condition: false
};

export default If;
