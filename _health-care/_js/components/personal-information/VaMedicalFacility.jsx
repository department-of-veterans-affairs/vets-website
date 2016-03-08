import React from 'react';
import _ from 'lodash';

/**
 * Select component for preferred VA Medical Facility.
 *
 * No validation is provided since base UI elements provide all
 * common options as provided in reference PDF/JS form.
 *
 * Props:
 * `value` - String. Stores the medical facility value.
 * `onValueChange` - a function with this prototype: (newValue)
 */
class VaMedicalFacility extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.selectId = _.uniqueId('preferred-va-facility-');
  }

  handleChange(domEvent) {
    this.props.onValueChange(domEvent.target.value);
  }

  // TODO: Add the actual list of medical facilities
  // TODO: Filter list based on state selected?
  render() {
    return (
      <div className="usa-input-grid usa-input-grid-large">
        <label htmlFor={this.selectId}>
          Center/Clinic
        </label>
        <select
            id={this.selectId}
            onChange={this.handleChange}
            value={this.props.value}>
          <option value=""></option>
          <option value="1">PUG</option>
          <option value="2">Tampa VAMC</option>
        </select>
      </div>
    );
  }
}

VaMedicalFacility.propTypes = {
  value: React.PropTypes.string.isRequired,
  onValueChange: React.PropTypes.func.isRequired,
};

export default VaMedicalFacility;
