import React from 'react';

import Child from './Child';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import GrowableTable from '../form-elements/GrowableTable.jsx';

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

    if (this.props.external.receivesVaPension === true) {
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

export default ChildInformationSection;
