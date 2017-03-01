import React from 'react';

class If extends React.Component {

  render() {
    if (!!this.props.condition) {
      // may only contain one root child node
      return this.props.children;
    }
    return null;
  }

}

If.propTypes = {
  condition: React.PropTypes.bool.isRequired,
  children: React.PropTypes.node.isRequired
};

If.defaultProps = {
  condition: false
};

export default If;
