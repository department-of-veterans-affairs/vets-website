import React from 'react';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';

class AdditionalMilitaryInformationSection extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h4>Additional Information</h4>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableCheckbox
                label="Are you a Purple Heart award recipient?"
                checked={this.props.data.purpleHeartRecipient}
                onValueChange={(update) => {this.props.onStateChange('purpleHeartRecipient', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableCheckbox
                label="Are you a former prisoner of war?"
                checked={this.props.data.isFormerPow}
                onValueChange={(update) => {this.props.onStateChange('isFormerPow', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableCheckbox
                label="Did you serve in combat theater of operations after November 11, 1998?"
                checked={this.props.data.postNov111998Combat}
                onValueChange={(update) => {this.props.onStateChange('postNov111998Combat', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableCheckbox
                label="Were you discharged or retired from the military for a disability incurred in the line of duty?"
                checked={this.props.data.disabledInLineOfDuty}
                onValueChange={(update) => {this.props.onStateChange('disabledInLineOfDuty', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableCheckbox
                label="Did you serve in SW Asia during the Gulf War between August 2, 1990 and Nov 11, 1998?"
                checked={this.props.data.swAsiaCombatAug21990ToNov111998}
                onValueChange={(update) => {this.props.onStateChange('swAsiaCombatAug21990ToNov111998', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableCheckbox
                label="Did you serve in Vietnam between January 9, 1962 and May 7, 1975?"
                checked={this.props.data.vietnamServiceJan91962ToMay71975}
                onValueChange={(update) => {this.props.onStateChange('vietnamServiceJan91962ToMay71975', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableCheckbox
                label="Were you exposed to radiation while in the military?"
                checked={this.props.data.exposedToRadiation}
                onValueChange={(update) => {this.props.onStateChange('exposedToRadiation', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableCheckbox
                label="Did you receive nose and throat radium treatments while in the military?"
                checked={this.props.data.receivedNoseThroatRadiumTreatments}
                onValueChange={(update) => {this.props.onStateChange('receivedNoseThroatRadiumTreatments', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableCheckbox
                label="Did you serve on active duty at least 30 days at Camp LeJeune from January 1, 1957 through December 31, 1987?"
                checked={this.props.data.campLejeuneJan11957ToDec311987}
                onValueChange={(update) => {this.props.onStateChange('campLejeuneJan11957ToDec311987', update);}}/>
          </div>
        </div>
      </div>
    );
  }
}

export default AdditionalMilitaryInformationSection;
