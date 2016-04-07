import React from 'react';
import { connect } from 'react-redux';

import Child from './Child';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import GrowableTable from '../form-elements/GrowableTable.jsx';
import { veteranUpdateField, ensureFieldsInitialized } from '../../actions';

/**
 * Props:
 * `sectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
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
    let content;
    let editButton;
    let children;

    if (this.props.data.children) {
      const childList = this.props.data.children;
      let reactKey = 0;
      let childNumber = 0;
      children = childList.map((obj) => {
        const childFirstName = obj.childFullName.first;
        const childMiddleName = obj.childFullName.middle;
        const childLastName = obj.childFullName.last;
        const childSuffix = obj.childFullName.suffix;
        const childRelation = obj.childRelation;
        const childSocialSecurityNumber = obj.childSocialSecurityNumber;
        const childBecameDependentMonth = obj.childBecameDependent.month;
        const childBecameDependentDay = obj.childBecameDependent.day;
        const childBecameDependentYear = obj.childBecameDependent.year;
        const childDateOfBirthMonth = obj.childDateOfBirth.month;
        const childDateOfBirthDay = obj.childDateOfBirth.day;
        const childDateOfBirthYear = obj.childDateOfBirth.year;
        const childDisabledBefore18 = obj.childDisabledBefore18;
        const childAttendedSchoolLastYear = obj.childAttendedSchoolLastYear;
        const childEducationExpenses = obj.childEducationExpenses;
        const childCohabitedLastYear = obj.childCohabitedLastYear;
        const childReceivedSupportLastYear = obj.childReceivedSupportLastYear;
        return (<div key={++reactKey}>
          <p>Child {++childNumber}</p>
          <p>Name: {childFirstName} {childMiddleName} {childLastName} {childSuffix}</p>
          <p>Relationship to you: {childRelation}</p>
          <p>Social Security Number: {childSocialSecurityNumber}</p>
          <p>Date Child Became Dependent: {childBecameDependentMonth}/{childBecameDependentDay}/{childBecameDependentYear}</p>
          <p>Date of Birth: {childDateOfBirthMonth}/{childDateOfBirthDay}/{childDateOfBirthYear}</p>
          <p>Was child permanently and totally disabled before the age of 18?: {`${childDisabledBefore18 ? 'Yes' : 'No'}`}</p>
          <p>If child is between 18 and 23 years of age, did child attend school last calendar year?: {`${childAttendedSchoolLastYear ? 'Yes' : 'No'}`}</p>
          <p>Expenses paid by your dependent child for college, vocational rehabilitation or training (e.g., tuition, books, materials): {childEducationExpenses}</p>
          <p>Did your child live with you last year?: {`${childCohabitedLastYear ? 'Yes' : 'No'}`}</p>
          <p>If your dependent child did not live with you last year, did you provide support?: {`${childReceivedSupportLastYear ? 'Yes' : 'No'}`}</p>
          <hr/>
        </div>);
      });
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

    if (this.props.data.sectionComplete) {
      content = (<div>
        <p>Do you have any children to report?: {`${this.props.data.hasChildrenToReport ? 'Yes' : 'No'}`}</p>
        {children}
      </div>
        );
    } else {
      content = (<div>
        {notRequiredMessage}

        <div className="input-section">
          <ErrorableCheckbox
              label="Do you have any children to report?"
              checked={this.props.data.hasChildrenToReport}
              onValueChange={(update) => {this.props.onStateChange('hasChildrenToReport', update);}}/>
        </div>
        {childrenContent}
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
      <div>
        <h4>Children Information</h4>
        {editButton}
        {content}
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
