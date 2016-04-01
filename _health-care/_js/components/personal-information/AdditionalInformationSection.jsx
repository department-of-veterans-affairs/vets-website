import React from 'react';
import { connect } from 'react-redux';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import State from '../questions/State';
import VaMedicalFacility from './VaMedicalFacility';
import { veteranUpdateField } from '../../actions';

class AdditionalInformationSection extends React.Component {
  render() {
    return (
      <fieldset className={`${this.props.data.sectionComplete ? 'review-view' : 'edit-view'}`}>
        <h4>Additional Information</h4>
        <ErrorableCheckbox
            label={`${this.props.data.sectionComplete ? 'Edit' : 'Update'}`}
            checked={this.props.data.sectionComplete}
            className={`edit-checkbox ${this.props.reviewSection ? '' : 'hidden'}`}
            onValueChange={(update) => {this.props.onStateChange('sectionComplete', update);}}/>
        <div className="input-section">
          <ErrorableCheckbox
              label="I am enrolling to obtain minimal essential coverage under the affordable care act"
              checked={this.props.data.isEssentialAcaCoverage}
              onValueChange={(update) => {this.props.onStateChange('isEssentialAcaCoverage', update);}}/>
        </div>

        <div className="input-section">
          <h4>Select the VA Medical Facility which will be your preferred facility</h4>
          <State value={this.props.data.facilityState}
              onUserInput={(update) => {this.props.onStateChange('facilityState', update);}}/>
          <VaMedicalFacility value={this.props.data.vaMedicalFacility}
              facilityState={this.props.data.facilityState}
              onValueChange={(update) => {this.props.onStateChange('vaMedicalFacility', update);}}/>
        </div>

        <div className="input-section">
          <ErrorableCheckbox
              label="Do you want VA to contact you to schedule your first appointment?"
              checked={this.props.data.wantsInitialVaContact}
              onValueChange={(update) => {this.props.onStateChange('wantsInitialVaContact', update);}}/>
        </div>
      </fieldset>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.additionalInformation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(['additionalInformation', field], update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(AdditionalInformationSection);
export { AdditionalInformationSection };
