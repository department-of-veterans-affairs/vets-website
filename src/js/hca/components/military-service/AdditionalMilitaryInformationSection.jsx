import React from 'react';
import { connect } from 'react-redux';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import { veteranUpdateField } from '../../actions';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class AdditionalMilitaryInformationSection extends React.Component {
  render() {
    let content;

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Are you a Purple Heart award recipient?:</td>
            <td>{`${this.props.data.purpleHeartRecipient ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>Are you a former prisoner of war?:</td>
            <td>{`${this.props.data.isFormerPow ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>Did you serve in combat theater of operations after November 11, 1998?:</td>
            <td>{`${this.props.data.postNov111998Combat ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>Were you discharged or retired from the military for a disability incurred in the line of duty?:</td>
            <td>{`${this.props.data.disabledInLineOfDuty ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>Served in Southwest Asia during the Gulf War between August 2, 1990, and Nov 11, 1998:</td>
            <td>{`${this.props.data.swAsiaCombat ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>Served in Vietnam between January 9, 1962, and May 7, 1975:</td>
            <td>{`${this.props.data.vietnamService ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>Were you exposed to radiation while in the military?:</td>
            <td>{`${this.props.data.exposedToRadiation ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>Did you receive nose and throat radium treatments while in the military?:</td>
            <td>{`${this.props.data.radiumTreatments ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>Served on active duty at least 30 days at Camp Lejeune from January 1, 1953, through December 31, 1987:</td>
            <td>{`${this.props.data.campLejeune ? 'Yes' : 'No'}`}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<fieldset>
        <legend>Service History</legend>
        <p>Check all that apply to you.</p>
        <div className="input-section">
          <ErrorableCheckbox
              label="Purple Heart award recipient"
              name="purpleHeartRecipient"
              checked={this.props.data.purpleHeartRecipient}
              onValueChange={(update) => {this.props.onStateChange('purpleHeartRecipient', update);}}/>

          <ErrorableCheckbox
              label="Former prisoner of war"
              name="isFormerPow"
              checked={this.props.data.isFormerPow}
              onValueChange={(update) => {this.props.onStateChange('isFormerPow', update);}}/>

          <ErrorableCheckbox
              label="Served in combat theater of operations after November 11, 1998"
              name="postNov111998Combat"
              checked={this.props.data.postNov111998Combat}
              onValueChange={(update) => {this.props.onStateChange('postNov111998Combat', update);}}/>

          <ErrorableCheckbox
              label="Discharged or retired from the military for a disability incurred in the line of duty"
              name="disabledInLineOfDuty"
              checked={this.props.data.disabledInLineOfDuty}
              onValueChange={(update) => {this.props.onStateChange('disabledInLineOfDuty', update);}}/>

          <ErrorableCheckbox
              label="Served in Southwest Asia during the Gulf War between August 2, 1990, and Nov 11, 1998"
              name="swAsiaCombat"
              checked={this.props.data.swAsiaCombat}
              onValueChange={(update) => {this.props.onStateChange('swAsiaCombat', update);}}/>

          <ErrorableCheckbox
              label="Served in Vietnam between January 9, 1962, and May 7, 1975"
              name="vietnamService"
              checked={this.props.data.vietnamService}
              onValueChange={(update) => {this.props.onStateChange('vietnamService', update);}}/>

          <ErrorableCheckbox
              label="Exposed to radiation while in the military"
              name="exposedToRadiation"
              checked={this.props.data.exposedToRadiation}
              onValueChange={(update) => {this.props.onStateChange('exposedToRadiation', update);}}/>

          <ErrorableCheckbox
              label="Received nose/throat radium treatments while in the military"
              name="radiumTreatments"
              checked={this.props.data.radiumTreatments}
              onValueChange={(update) => {this.props.onStateChange('radiumTreatments', update);}}/>

          <ErrorableCheckbox
              label="Served on active duty at least 30 days at Camp Lejeune from January 1, 1953, through December 31, 1987"
              name="campLejeune"
              checked={this.props.data.campLejeune}
              onValueChange={(update) => {this.props.onStateChange('campLejeune', update);}}/>
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
    isSectionComplete: state.uiState.sections['/military-service/additional-information'].complete
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
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(AdditionalMilitaryInformationSection);
export { AdditionalMilitaryInformationSection };
