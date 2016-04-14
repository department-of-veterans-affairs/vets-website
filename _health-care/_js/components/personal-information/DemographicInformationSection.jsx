import React from 'react';
import { connect } from 'react-redux';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import { updateReviewStatus, veteranUpdateField } from '../../actions';

/**
 * Props:
 * `sectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class DemographicInformationSection extends React.Component {
  render() {
    let content;
    let editButton;

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<div>
        <table className="review usa-table-borderless">
          <tbody>
            <tr>
              <td>Are you Spanish, Hispanic, or Latino?:</td>
              <td>{`${this.props.data.isSpanishHispanicLatino ? 'Yes' : 'No'}`}</td>
            </tr>
          </tbody>
        </table>
        <h4>What is your race?</h4>
        <table className="review usa-table-borderless">
          <tbody>
            <tr>
              <td>American Indian or Alaksan Native:</td>
              <td>{`${this.props.data.isAmericanIndianOrAlaskanNative ? 'Yes' : ''}`}</td>
            </tr>
            <tr>
              <td>Black or African American:</td>
              <td>{`${this.props.data.isBlackOrAfricanAmerican ? 'Yes' : ''}`}</td>
            </tr>
            <tr>
              <td>Native Hawaiian or Other Pacific Islander:</td>
              <td>{`${this.props.data.isNativeHawaiianOrOtherPacificIslander ? 'Yes' : ''}`}</td>
            </tr>
            <tr>
              <td>Asian:</td>
              <td>{`${this.props.data.isAsian ? 'Yes' : ''}`}</td>
            </tr>
            <tr>
              <td>White:</td>
              <td>{`${this.props.data.isWhite ? 'Yes' : ''}`}</td>
            </tr>
          </tbody>
        </table>
      </div>);
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
          label={`${this.props.isSectionComplete ? 'Edit' : 'Update'}`}
          checked={this.props.isSectionComplete}
          className="edit-checkbox"
          onValueChange={(update) => {this.props.onUIStateChange(update);}}/>
      );
    }
    return (
      <div>
        <h4>Demographic Information</h4>
        {editButton}
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran.demographicInformation,
    isSectionComplete: state.uiState.completedSections['/personal-information/demographic-information']
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(['demographicInformation', field], update));
    },
    onUIStateChange: (update) => {
      dispatch(updateReviewStatus(['/personal-information/demographic-information'], update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(DemographicInformationSection);
export { DemographicInformationSection };
