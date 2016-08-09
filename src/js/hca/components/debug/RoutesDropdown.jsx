import React from 'react';

import routes from '../../routes';

/**
 * Button to auto-populate every field in the model with valid data.
 */
class RoutesDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.context.router.push(event.target.value);
  }

  render() {
    const optionElements = routes.map((route) => {
      return (<option key={route.key} value={route.props.path}>{route.props.path}</option>);
    });
    const currentValue = routes.find((route) => {
      return this.context.router.isActive(route.props.path, true);
    });
    return (
      <select value={currentValue} onChange={this.handleChange}>
        {optionElements}
      </select>
    );
  }
}

RoutesDropdown.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default RoutesDropdown;

