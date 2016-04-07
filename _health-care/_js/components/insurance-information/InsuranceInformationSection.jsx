import React from 'react';
import { connect } from 'react-redux';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import GrowableTable from '../form-elements/GrowableTable.jsx';
import Provider from './Provider.jsx';
import { veteranUpdateField, ensureFieldsInitialized } from '../../actions';

/**
 * Props:
 * `sectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class InsuranceInformationSection extends React.Component {
  // TODO(awong): Pull this out into a model.
  createBlankProvider() {
    return {
      insuranceName: null,
      insuranceAddress: null,
      insuranceCity: null,
      insuranceCountry: null,
      insuranceState: null,
      insuranceZipcode: null,
      insurancePhone: null,
      insurancePolicyHolderName: null,
      insurancePolicyNumber: null,
      insuranceGroupCode: null,
    };
  }

  render() {
    let providersTable;
    let content;
    let editButton;
    let providers;

    if (this.props.data.isCoveredByHealthInsurance) {
      providersTable = (
        <GrowableTable
            component={Provider}
            createRow={this.createBlankProvider}
            data={this.props.data}
            initializeCurrentElement={() => {this.props.initializeFields();}}
            onRowsUpdate={(update) => {this.props.onStateChange('providers', update);}}
            path="/insurance-information/general"
            rows={this.props.data.providers}/>
      );
    }


    if (this.props.data.providers) {
      const providersList = this.props.data.providers;
      let reactKey = 0;
      providers = providersList.map((obj) => {
        const insuranceName = obj.insuranceName;
        const insuranceAddress = obj.insuranceAddress;
        const insuranceCity = obj.insuranceCity;
        const insuranceCountry = obj.insuranceCountry;
        const insuranceState = obj.insuranceState;
        const insuranceZipcode = obj.insuranceZipcode;
        const insurancePhone = obj.insurancePhone;
        const insurancePolicyHolderName = obj.insurancePolicyHolderName;
        const insurancePolicyNumber = obj.insurancePolicyNumber;
        const insuranceGroupCode = obj.insuranceGroupCode;
        return (<div key={++reactKey}>
          <p>Provider {++reactKey}</p>
          <p>{insuranceName}</p>
          <p>{insuranceAddress}</p>
          <p>{insuranceCity}</p>
          <p>{insuranceCountry}</p>
          <p>{insuranceState}</p>
          <p>{insuranceZipcode}</p>
          <p>{insurancePhone}</p>
          <p>{insurancePolicyHolderName}</p>
          <p>{insurancePolicyNumber}</p>
          <p>{insuranceGroupCode}</p>
          <hr/>
        </div>);
      });
    }

    if (this.props.data.sectionComplete) {
      content = (<div>
        <p>Are you covered by health insurance? (Including coverage through a spouse or another person): {`${this.props.data.isCoveredByHealthInsurance ? 'Yes' : 'No'}`}</p>
        {providers}
      </div>
        );
    } else {
      content = (<div>
        <ErrorableCheckbox
            label="Are you covered by health insurance? (Including coverage through a spouse or another person)"
            checked={this.props.data.isCoveredByHealthInsurance}
            onValueChange={(update) => {this.props.onStateChange('isCoveredByHealthInsurance', update);}}/>
        <hr/>
        {providersTable}
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
      <fieldset>
        <div className="input-section">
          <h4>Coverage Information</h4>
          {editButton}
          {content}
        </div>
      </fieldset>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.insuranceInformation
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(['insuranceInformation', field], update));
    },
    initializeFields: () => {
      dispatch(ensureFieldsInitialized('/insurance-information/general'));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(InsuranceInformationSection);
export { InsuranceInformationSection };
