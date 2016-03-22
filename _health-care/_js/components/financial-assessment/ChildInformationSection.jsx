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
    return (
      <div>
        <h4>Children Information</h4>
        {this.props.external.receivesVaPension === true &&
          <p>
            <strong>
            You are not required to enter financial information because you
            indicated you are receiving a VA pension.
            </strong>
          </p>
        }
        <div className="input-section">
          <ErrorableCheckbox
              label="Do you have any children to report?"
              checked={this.props.data.hasChildrenToReport}
              onValueChange={(update) => {this.props.onStateChange('hasChildrenToReport', update);}}/>

          {this.props.data.hasChildrenToReport === true &&
            <GrowableTable
                component={Child}
                createRow={this.createBlankChild}
                onRowsUpdate={(update) => {this.props.onStateChange('children', update);}}
                rows={this.props.data.children}/>
          }
        </div>
      </div>
    );
  }
}

export default ChildInformationSection;
