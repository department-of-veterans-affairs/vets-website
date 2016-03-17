import React from 'react';
import _ from 'lodash';

import ErrorableSelect from '../form-elements/ErrorableSelect';

import { vaMedicalFacilities } from '../../utils/options-for-select.js';

/**
 * Select component for preferred VA Medical Facility.
 *
 * No validation is provided since base UI elements provide all
 * common options as provided in reference PDF/JS form.
 *
 * Props:
 * `value` - String. Stores the medical facility value.
 * `onValueChange` - a function with this prototype: (newValue)
 * `facilityState` - String. Passes the state name prop from facilityState.
 */

class VaMedicalFacility extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.selectId = _.uniqueId('preferred-va-facility-');
  }

  handleChange(update) {
    this.props.onValueChange(update);
  }

  render() {
    let clinicList = [];
    const selectedState = this.props.facilityState;
    if (selectedState) {
      clinicList = vaMedicalFacilities[selectedState];
    }

    return (
      <div className="usa-input-grid usa-input-grid-large">
        <ErrorableSelect
            label="Center/Clinic"
            options={clinicList}
            value={this.props.value}
            onValueChange={this.handleChange}/>
      </div>
    );
  }
}

VaMedicalFacility.propTypes = {
  value: React.PropTypes.string.isRequired,
  facilityState: React.PropTypes.string.isRequired,
  onValueChange: React.PropTypes.func.isRequired,
};

export default VaMedicalFacility;
