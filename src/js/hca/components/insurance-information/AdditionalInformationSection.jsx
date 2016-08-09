import React from 'react';
import { connect } from 'react-redux';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import ErrorableSelect from '../form-elements/ErrorableSelect';
import ErrorableRadioButtons from '../form-elements/ErrorableRadioButtons';
import VaMedicalFacility from './VaMedicalFacility';
import { veteranUpdateField } from '../../actions';
import { states, vaMedicalFacilities, yesNo } from '../../utils/options-for-select';
import { validateIfDirty, isNotBlank } from '../../utils/validations';
import { displayLabel } from '../../store/calculated';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class AdditionalInformationSection extends React.Component {
  render() {
    let content;
    const selectedFacilityState = this.props.data.facilityState.value;
    const FacilitiesWithinState = vaMedicalFacilities[selectedFacilityState];
    const selectedVaMedicalFacility = this.props.data.vaMedicalFacility.value;

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>I am enrolling to obtain minimum essential coverage under the Affordable Care Act:</td>
            <td>{`${this.props.data.isEssentialAcaCoverage ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>Preferred VA medical facility:</td>
            <td>{displayLabel(FacilitiesWithinState, selectedVaMedicalFacility)}</td>
          </tr>
          <tr>
            <td>Do you want VA to contact you to schedule your first appointment?:</td>
            <td>{`${this.props.data.wantsInitialVaContact.value === 'Y' ? 'Yes' : 'No'}`}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<fieldset>
        {/* TODO: Change the headings to something related to the questions. */}
        <legend>Additional Information</legend>
        <p>(<span className="hca-required-span">*</span>) Indicates a required field</p>
        <div className="input-section">
          <ErrorableCheckbox
              label="I am enrolling to obtain minimum essential coverage under the Affordable Care Act"
              name="isEssentialAcaCoverage"
              checked={this.props.data.isEssentialAcaCoverage}
              onValueChange={(update) => {this.props.onStateChange('isEssentialAcaCoverage', update);}}/>
        </div>

        <div className="input-section">
          <h4>Select your preferred VA medical facility</h4>
          <ErrorableSelect required
              errorMessage={validateIfDirty(this.props.data.facilityState, isNotBlank) ? undefined : 'Please select a state'}
              label="State"
              name="state"
              options={states.USA}
              value={this.props.data.facilityState}
              onValueChange={(update) => {this.props.onStateChange('facilityState', update);}}/>
          <VaMedicalFacility required
              value={this.props.data.vaMedicalFacility}
              facilityState={this.props.data.facilityState}
              onValueChange={(update) => {this.props.onStateChange('vaMedicalFacility', update);}}/>
          OR <a target="_blank" href="/facility-locator">Find locations with the VA Facility Locator</a>
        </div>

        <div className="input-section">
          <ErrorableRadioButtons
              label="Do you want VA to contact you to schedule your first appointment?"
              name="wantsInitialVaContact"
              options={yesNo}
              value={this.props.data.wantsInitialVaContact}
              onValueChange={(update) => {this.props.onStateChange('wantsInitialVaContact', update);}}/>
        </div>
      </fieldset>);
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran,
    isSectionComplete: state.uiState.sections['/insurance-information/va-facility'].complete
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(field, update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(AdditionalInformationSection);
export { AdditionalInformationSection };
