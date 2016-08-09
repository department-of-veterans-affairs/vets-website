import React from 'react';
import { connect } from 'react-redux';

import ErrorableRadioButtons from '../form-elements/ErrorableRadioButtons';
import GrowableTable from '../form-elements/GrowableTable.jsx';
import Provider from './Provider.jsx';
import { yesNo } from '../../utils/options-for-select.js';
import { isNotBlank, validateIfDirty } from '../../utils/validations';
import { veteranUpdateField, ensureFieldsInitialized } from '../../actions';

import { makeField } from '../../../common/fields';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class InsuranceInformationSection extends React.Component {
  // TODO(awong): Pull this out into a model.
  createBlankProvider() {
    return {
      insuranceName: makeField(''),
      insurancePolicyHolderName: makeField(''),
      insurancePolicyNumber: makeField(''),
      insuranceGroupCode: makeField(''),
    };
  }

  render() {
    let providersTable;
    let content;
    let providers;
    const fields = ['insuranceName', 'insurancePolicyHolderName', 'insurancePolicyNumber', 'insuranceGroupCode'];

    if (this.props.data.isCoveredByHealthInsurance.value === 'Y') {
      providersTable = (
        <GrowableTable
            component={Provider}
            createRow={this.createBlankProvider}
            data={this.props.data}
            initializeCurrentElement={() => {this.props.initializeFields(fields);}}
            onRowsUpdate={(update) => {this.props.onStateChange('providers', update);}}
            path="/insurance-information/general"
            rows={this.props.data.providers}/>
      );
    } else {
      this.props.data.providers.length = 0;
    }


    if (this.props.data.providers) {
      const providersList = this.props.data.providers;
      let reactKey = 0;
      providers = providersList.map((obj) => {
        const insuranceName = obj.insuranceName.value;
        const insurancePolicyHolderName = obj.insurancePolicyHolderName.value;
        const insurancePolicyNumber = obj.insurancePolicyNumber.value;
        const insuranceGroupCode = obj.insuranceGroupCode.value;
        return (<table key={++reactKey} className="review usa-table-borderless">
          <thead>
            <tr>
              <td scope="col">Provider - {insuranceName}</td>
              <td scope="col"></td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Name of policy holder:</td>
              <td>{insurancePolicyHolderName}</td>
            </tr>
            <tr>
              <td>Policy number:</td>
              <td>{insurancePolicyNumber}</td>
            </tr>
            <tr>
              <td>Group code:</td>
              <td>{insuranceGroupCode}</td>
            </tr>
          </tbody>
        </table>);
      });
    }

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<div>
        <table className="review usa-table-borderless">
          <tbody>
            <tr>
              <td>Are you covered by health insurance? (Including coverage through a spouse or another person):</td>
              <td>{`${this.props.data.isCoveredByHealthInsurance.value === 'Y' ? 'Yes' : 'No'}`}</td>
            </tr>
          </tbody>
        </table>
      {providers}
      </div>);
    } else {
      content = (<fieldset>
        <legend>Coverage Information</legend>
        <ErrorableRadioButtons required
            errorMessage={validateIfDirty(this.props.data.isCoveredByHealthInsurance, isNotBlank) ? '' : 'Please select a response'}
            label="Are you covered by health insurance? (Including coverage through a spouse or another person)"
            name="isCoveredByHealthInsurance"
            options={yesNo}
            value={this.props.data.isCoveredByHealthInsurance}
            onValueChange={(update) => {this.props.onStateChange('isCoveredByHealthInsurance', update);}}/>
        <hr/>
        {providersTable}
      </fieldset>);
    }

    return (
      <div className="input-section">
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran,
    isSectionComplete: state.uiState.sections['/insurance-information/general'].complete
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(field, update));
    },
    initializeFields: (fields) => {
      dispatch(ensureFieldsInitialized(fields, 'providers'));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(InsuranceInformationSection);
export { InsuranceInformationSection };
