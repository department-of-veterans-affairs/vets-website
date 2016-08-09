import React from 'react';
import { connect } from 'react-redux';

import ErrorableRadioButtons from '../form-elements/ErrorableRadioButtons';
import { yesNo } from '../../utils/options-for-select';
import { validateIfDirty, isNotBlank } from '../../utils/validations';
import { veteranUpdateField } from '../../actions';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class VAInformationSection extends React.Component {
  render() {
    let content;

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Are you VA Service Connected 50% to 100% Disabled?:</td>
            <td>{`${this.props.data.isVaServiceConnected.value === 'Y' ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>Do you currently receive monetary compensation (pay) from the VA for a service-connected disability with a rating of 10%, 20%, 30%, or 40%?:</td>
            <td>{`${this.props.data.compensableVaServiceConnected.value === 'Y' ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>Do you receive a VA pension?:</td>
            <td>{`${this.props.data.receivesVaPension.value === 'Y' ? 'Yes' : 'No'}`}</td>
          </tr>
        </tbody>
      </table>
        );
    } else {
      content = (<fieldset>
        <legend>VA Benefits</legend>
        <p>(<span className="hca-required-span">*</span>) Indicates a required field</p>
        <div className="input-section">
          <ErrorableRadioButtons required
              errorMessage={validateIfDirty(this.props.data.compensableVaServiceConnected, isNotBlank) ? '' : 'Please select a response'}
              label="Do you currently receive monetary compensation (pay) from the VA for a service-connected disability with a rating of 10%, 20%, 30%, or 40%?"
              name="compensableVaServiceConnected"
              options={yesNo}
              value={this.props.data.compensableVaServiceConnected}
              onValueChange={(update) => {this.props.onStateChange('compensableVaServiceConnected', update);}}/>

          <ErrorableRadioButtons required
              errorMessage={validateIfDirty(this.props.data.isVaServiceConnected, isNotBlank) ? '' : 'Please select a response'}
              label="Do you currently receive monetary compensation (pay) from the VA for a service-connected disability with a rating of 50% or more?"
              name="isVaServiceConnected"
              options={yesNo}
              value={this.props.data.isVaServiceConnected}
              onValueChange={(update) => {this.props.onStateChange('isVaServiceConnected', update);}}/>

          <ErrorableRadioButtons required
              errorMessage={validateIfDirty(this.props.data.receivesVaPension, isNotBlank) ? '' : 'Please select a response'}
              label="Do you receive a VA pension?"
              name="receivesVaPension"
              options={yesNo}
              value={this.props.data.receivesVaPension}
              onValueChange={(update) => {this.props.onStateChange('receivesVaPension', update);}}/>
        </div>
      </fieldset>);
    }

    return (
      <div className="row">
        <div className="small-12 columns">
          {content}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran,
    isSectionComplete: state.uiState.sections['/va-benefits/basic-information'].complete
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
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(VAInformationSection);
export { VAInformationSection };
