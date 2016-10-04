import React from 'react';

import GrowableTable from '../../../common/components/form-elements/GrowableTable';
import { isValidPage } from '../../../common/utils/validations';
import { createPreviousClaim } from '../../utils/veteran';
import PreviousClaim from './PreviousClaim';

const claimFields = [
  'claimType',
  'sponsorVeteran',
  'fileNumber'
];

export default class PreviousClaimsFields extends React.Component {
  render() {
    return (<fieldset>
      <legend>Previous claims</legend>
      <div className="input-section">
        <hr/>
        <GrowableTable
            component={PreviousClaim}
            createRow={createPreviousClaim}
            data={this.props.data}
            initializeCurrentElement={() => this.props.initializeFields(claimFields, 'previousVaClaims')}
            onRowsUpdate={(update) => {this.props.onStateChange('previousVaClaims', update);}}
            path="/benefits-eligibility/previous-claims"
            rows={this.props.data.previousVaClaims}
            isValidSection={isValidPage}/>
      </div>
    </fieldset>
    );
  }
}

PreviousClaimsFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
