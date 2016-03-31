import React from 'react';
import { connect } from 'react-redux';

import Child from './Child';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import ErrorableRadioButtons from '../form-elements/ErrorableRadioButtons';
import GrowableTable from '../form-elements/GrowableTable.jsx';
import { veteranUpdateField, ensureFieldsInitialized } from '../../actions';

/**
 * Props:
 * `sectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
import { yesNo } from '../../utils/options-for-select.js';

class ChildInformationSection extends React.Component {
  // TODO(awong): Pull this out into a model.
  createBlankChild() {
    return {
      childFullName: {
        first: null,
        middle: null,
        last: null,
        suffix: null
      },
      childRelation: null,
      childSocialSecurityNumber: null,
      childBecameDependent: {
        month: null,
        day: null,
        year: null
      },
      childDateOfBirth: {
        month: null,
        day: null,
        year: null
      },
      childDisabledBefore18: false,
      childAttendedSchoolLastYear: false,
      childEducationExpenses: null,
      childCohabitedLastYear: false,
      childReceivedSupportLastYear: false
    };
  }

  render() {
    let notRequiredMessage;
    let childrenContent;

    if (this.props.receivesVaPension === true) {
      notRequiredMessage = (
        <p>
          <strong>
            You are not required to enter financial information because you
            indicated you are receiving a VA pension.
          </strong>
        </p>
      );
    }

    if (this.props.data.hasChildrenToReport === true) {
      childrenContent = (
        <div className="input-section">
          <hr/>
          <GrowableTable
              component={Child}
              createRow={this.createBlankChild}
              data={this.props.data}
              initializeCurrentElement={() => {this.props.initializeFields();}}
              onRowsUpdate={(update) => {this.props.onStateChange('children', update);}}
              path="/financial-assessment/child-information"
              rows={this.props.data.children}/>
        </div>
      );
    }

    return (
      <div>
        <h4>Children Information</h4>
        <ErrorableCheckbox
            label={`${this.props.data.sectionComplete ? 'Edit' : 'Update'}`}
            checked={this.props.data.sectionComplete}
            className={`edit-checkbox ${this.props.reviewSection ? '' : 'hidden'}`}
            onValueChange={(update) => {this.props.onStateChange('sectionComplete', update);}}/>

        {notRequiredMessage}

        <div className="input-section">
          <ErrorableRadioButtons
              label="Do you have any children to report?"
              options={yesNo}
              value={this.props.data.hasChildrenToReport}
              required
              onValueChange={(update) => {this.props.onStateChange('hasChildrenToReport', update);}}/>
        </div>
        {childrenContent}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.childInformation,
    receivesVaPension: state.vaInformation.receivesVaPension,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(['childInformation', field], update));
    },
    initializeFields: () => {
      dispatch(ensureFieldsInitialized('/financial-assessment/child-information'));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(ChildInformationSection);
export { ChildInformationSection };
