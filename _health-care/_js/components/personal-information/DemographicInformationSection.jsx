import React from 'react';
import { connect } from 'react-redux';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import { veteranUpdateField } from '../../actions';

/**
 * Props:
 * `sectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class DemographicInformationSection extends React.Component {
  render() {
    let content;
    let editButton;

    if (this.props.data.sectionComplete) {
      content = (<div>
        <p>Are you Spanish, Hispanic, or Latino?: {`${this.props.data.isSpanishHispanicLatino ? 'Yes' : 'No'}`}</p>
        <p>Race:</p>
        <p>{`${this.props.data.isAmericanIndianOrAlaskanNative ? 'American Indian or Alaksan Native' : ''}`}</p>
        <p>{`${this.props.data.isBlackOrAfricanAmerican ? 'Black or African American' : ''}`}</p>
        <p>{`${this.props.data.isNativeHawaiianOrOtherPacificIslander ? 'Native Hawaiian or Other Pacific Islander' : ''}`}</p>
        <p>{`${this.props.data.isAsian ? 'Asian' : ''}`}</p>
        <p>{`${this.props.data.isWhite ? 'White' : ''}`}</p>
      </div>
        );
    } else {
      content = (<div>
        <div className="input-section">
          <ErrorableCheckbox
              label="Are you Spanish, Hispanic, or Latino?"
              checked={this.props.data.isSpanishHispanicLatino}
              onValueChange={(update) => {this.props.onStateChange('isSpanishHispanicLatino', update);}}/>
        </div>

        <div className="input-section">
          <h4>What is your race?</h4>
          <span className="usa-form-hint">You may check more than one.</span>
          <ErrorableCheckbox
              label="American Indian or Alaksan Native"
              checked={this.props.data.isAmericanIndianOrAlaskanNative}
              onValueChange={(update) => {this.props.onStateChange('isAmericanIndianOrAlaskanNative', update);}}/>

          <ErrorableCheckbox
              label="Black or African American"
              checked={this.props.data.isBlackOrAfricanAmerican}
              onValueChange={(update) => {this.props.onStateChange('isBlackOrAfricanAmerican', update);}}/>

          <ErrorableCheckbox
              label="Native Hawaiian or Other Pacific Islander"
              checked={this.props.data.isNativeHawaiianOrOtherPacificIslander}
              onValueChange={(update) => {this.props.onStateChange('isNativeHawaiianOrOtherPacificIslander', update);}}/>

          <ErrorableCheckbox
              label="Asian"
              checked={this.props.data.isAsian}
              onValueChange={(update) => {this.props.onStateChange('isAsian', update);}}/>

          <ErrorableCheckbox
              label="White"
              checked={this.props.data.isWhite}
              onValueChange={(update) => {this.props.onStateChange('isWhite', update);}}/>
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
      <div className={`${this.props.data.sectionComplete ? 'review-view' : 'edit-view'}`}>
        <h4>Demographic Information</h4>
        {editButton}
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.demographicInformation
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(['demographicInformation', field], update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(DemographicInformationSection);
export { DemographicInformationSection };
