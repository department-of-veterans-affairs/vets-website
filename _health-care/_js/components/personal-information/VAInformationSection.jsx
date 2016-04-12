import React from 'react';
import { connect } from 'react-redux';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import ErrorableRadioButtons from '../form-elements/ErrorableRadioButtons';
import { yesNo } from '../../utils/options-for-select';
import { isNotBlank } from '../../utils/validations';
import { veteranUpdateField } from '../../actions';

/**
 * Props:
 * `sectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class VaInformationSection extends React.Component {
  render() {
    let content;
    let editButton;

    if (this.props.data.sectionComplete) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Are you VA Service Connected 50% to 100% Disabled?:</td>
            <td>{`${this.props.data.isVaServiceConnected ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>Are you compensable VA Service Connected 0% - 40%?:</td>
            <td>{`${this.props.data.compensableVaServiceConnected ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>Do you receive a VA pension?:</td>
            <td>{`${this.props.data.receivesVaPension ? 'Yes' : 'No'}`}</td>
          </tr>
        </tbody>
      </table>
        );
    } else {
      content = (<div>
        <p>
          Please review the following list and select all the responses that apply to you.
          This information will be used to determine which sections of the Application for
          Health Benefits you should complete.
        </p>

        <div className="input-section">
          <ErrorableRadioButtons required
              errorMessage={isNotBlank(this.props.data.isVaServiceConnected) ? '' : 'Please select a response'}
              label="Are you VA Service Connected 50% to 100% Disabled?"
              options={yesNo}
              value={this.props.data.isVaServiceConnected}
              onValueChange={(update) => {this.props.onStateChange('isVaServiceConnected', update);}}/>
          {this.props.data.isVaServiceConnected === true &&
            <div>
              <ErrorableCheckbox
                  label="Are you compensable VA Service Connected 0% - 40%?"
                  checked={this.props.data.compensableVaServiceConnected}
                  onValueChange={(update) => {this.props.onStateChange('compensableVaServiceConnected', update);}}/>
              <span>
                A VA determination that a Service-connected disability is severe enough to warrant monetary compensation.
              </span>
            </div>
          }
          {this.props.data.isVaServiceConnected === true && this.props.data.compensableVaServiceConnected === true &&
            <ErrorableCheckbox
                label="Do you receive a VA pension?"
                checked={this.props.data.receivesVaPension}
                onValueChange={(update) => {this.props.onStateChange('receivesVaPension', update);}}/>
          }
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
      <div className="row">
        <div className="small-12 columns">
          <h4>Veteran</h4>
          {editButton}
          {content}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.vaInformation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(['vaInformation', field], update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(VaInformationSection);
export { VaInformationSection };

