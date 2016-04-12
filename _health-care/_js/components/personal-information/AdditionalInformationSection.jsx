import React from 'react';
import { connect } from 'react-redux';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import State from '../questions/State';
import VaMedicalFacility from './VaMedicalFacility';
import { veteranUpdateField } from '../../actions';

/**
 * Props:
 * `sectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class AdditionalInformationSection extends React.Component {
  render() {
    let content;
    let editButton;

    if (this.props.data.sectionComplete) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>I am enrolling to obtain minimal essential coverage under the affordable care act:</td>
            <td>{`${this.props.data.isEssentialAcaCoverage ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>Preferred VA Medical Facility:</td>
            <td>{this.props.data.vaMedicalFacility} in {this.props.data.facilityState}</td>
          </tr>
          <tr>
            <td>Do you want VA to contact you to schedule your first appointment?:</td>
            <td>{`${this.props.data.wantsInitialVaContact ? 'Yes' : 'No'}`}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<div>
        <div className="input-section">
          <ErrorableCheckbox
              label="I am enrolling to obtain minimal essential coverage under the affordable care act"
              checked={this.props.data.isEssentialAcaCoverage}
              onValueChange={(update) => {this.props.onStateChange('isEssentialAcaCoverage', update);}}/>
        </div>

        <div className="input-section">
          <h4>Select the VA Medical Facility which will be your preferred facility</h4>
          <State required
              value={this.props.data.facilityState}
              onUserInput={(update) => {this.props.onStateChange('facilityState', update);}}/>
          <VaMedicalFacility required
              value={this.props.data.vaMedicalFacility}
              facilityState={this.props.data.facilityState}
              onValueChange={(update) => {this.props.onStateChange('vaMedicalFacility', update);}}/>
          OR <a target="_blank" href="http://www.va.gov/directory/guide/home.asp">Go to the VA Facility Locator</a>
        </div>

        <div className="input-section">
          <ErrorableCheckbox
              label="Do you want VA to contact you to schedule your first appointment?"
              checked={this.props.data.wantsInitialVaContact}
              onValueChange={(update) => {this.props.onStateChange('wantsInitialVaContact', update);}}/>
        </div>
      </div>);
    }

    if (this.props.reviewSection) {
      editButton = (<ErrorableCheckbox
          label={`${this.props.data.sectionComplete ? 'Edit' : 'Update'}`}
          checked={this.props.data.sectionComplete}
          className="edit-checkbox"
          onValueChange={(update) => {this.props.onStateChange('sectionComplete', update);}}/>
      );
    }
    return (
      <fieldset>
        <h4>Additional Information</h4>
        {editButton}
        {content}
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
