import React from 'react';
import { connect } from 'react-redux';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import { veteranUpdateField } from '../../actions';

class AdditionalMilitaryInformationSection extends React.Component {
  render() {
    return (
      <div>
        <h4>Additional Information</h4>

        <div className="input-section">
          <ErrorableCheckbox
              label="Are you a Purple Heart award recipient?"
              checked={this.props.data.purpleHeartRecipient}
              onValueChange={(update) => {this.props.onStateChange('purpleHeartRecipient', update);}}/>

          <ErrorableCheckbox
              label="Are you a former prisoner of war?"
              checked={this.props.data.isFormerPow}
              onValueChange={(update) => {this.props.onStateChange('isFormerPow', update);}}/>

          <ErrorableCheckbox
              label="Did you serve in combat theater of operations after November 11, 1998?"
              checked={this.props.data.postNov111998Combat}
              onValueChange={(update) => {this.props.onStateChange('postNov111998Combat', update);}}/>

          <ErrorableCheckbox
              label="Were you discharged or retired from the military for a disability incurred in the line of duty?"
              checked={this.props.data.disabledInLineOfDuty}
              onValueChange={(update) => {this.props.onStateChange('disabledInLineOfDuty', update);}}/>

          <ErrorableCheckbox
              label="Did you serve in SW Asia during the Gulf War between August 2, 1990 and Nov 11, 1998?"
              checked={this.props.data.swAsiaCombat}
              onValueChange={(update) => {this.props.onStateChange('swAsiaCombat', update);}}/>

          <ErrorableCheckbox
              label="Did you serve in Vietnam between January 9, 1962 and May 7, 1975?"
              checked={this.props.data.vietnamService}
              onValueChange={(update) => {this.props.onStateChange('vietnamService', update);}}/>

          <ErrorableCheckbox
              label="Were you exposed to radiation while in the military?"
              checked={this.props.data.exposedToRadiation}
              onValueChange={(update) => {this.props.onStateChange('exposedToRadiation', update);}}/>

          <ErrorableCheckbox
              label="Did you receive nose and throat radium treatments while in the military?"
              checked={this.props.data.radiumTreatments}
              onValueChange={(update) => {this.props.onStateChange('radiumTreatments', update);}}/>

          <ErrorableCheckbox
              label="Did you serve on active duty at least 30 days at Camp LeJeune from January 1, 1957 through December 31, 1987?"
              checked={this.props.data.campLejeune}
              onValueChange={(update) => {this.props.onStateChange('campLejeune', update);}}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.militaryAdditionalInfo
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(['militaryAdditionalInfo', field], update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(AdditionalMilitaryInformationSection);
export { AdditionalMilitaryInformationSection };
