import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import ErrorableSelect from '../../../common/components/form-elements/ErrorableSelect';
import { validateIfDirty, isNotBlank } from '../../../common/utils/validations';
import { vaMedicalFacilities } from '../../../common/utils/options-for-select.js';

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
    const selectedState = this.props.facilityState.value;
    if (selectedState) {
      clinicList = vaMedicalFacilities[selectedState];
      clinicList = _.sortBy(clinicList, 'label');
    }

    return (
      <div className="usa-input-grid usa-input-grid-large">
        <ErrorableSelect required={this.props.required}
            errorMessage={validateIfDirty(this.props.value, isNotBlank) ? undefined : 'Please select a medical facility'}
            label="Center/clinic"
            name="vaMedicalFacility"
            options={clinicList}
            value={this.props.value}
            onValueChange={this.handleChange}/>
      </div>
    );
  }
}

VaMedicalFacility.propTypes = {
  required: PropTypes.bool,
  value: PropTypes.shape({
    value: PropTypes.string,
    dirty: PropTypes.bool
  }).isRequired,
  facilityState: PropTypes.shape({
    value: PropTypes.string,
    dirty: PropTypes.bool
  }).isRequired,
  onValueChange: PropTypes.func.isRequired,
};

export default VaMedicalFacility;
