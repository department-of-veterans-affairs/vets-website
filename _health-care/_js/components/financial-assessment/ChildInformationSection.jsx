import React from 'react';
import { connect } from 'react-redux';

import Child from './Child';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import GrowableTable from '../form-elements/GrowableTable.jsx';
import { veteranUpdateField } from '../../actions';

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
    let hasChildrenContent;

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
      hasChildrenContent = (
        <GrowableTable
            component={Child}
            createRow={this.createBlankChild}
            onRowsUpdate={(update) => {this.props.onStateChange('children', update);}}
            rows={this.props.data.children}/>
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
          <ErrorableCheckbox
              label="Do you have any children to report?"
              checked={this.props.data.hasChildrenToReport}
              onValueChange={(update) => {this.props.onStateChange('hasChildrenToReport', update);}}/>

          {hasChildrenContent}

        </div>
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
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(ChildInformationSection);
export { ChildInformationSection };
