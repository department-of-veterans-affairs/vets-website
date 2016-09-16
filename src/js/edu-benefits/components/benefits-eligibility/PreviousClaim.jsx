import React from 'react';

import ErrorableSelect from '../../../common/components/form-elements/ErrorableSelect';
import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';
import FullName from '../../../common/components/questions/FullName';

import { validateIfDirty, isNotBlank } from '../../utils/validations';
import { claimTypes, yesNo } from '../../utils/options-for-select';
import { getLabel, showSomeoneElseServiceQuestion } from '../../utils/helpers';

export default class PreviousClaim extends React.Component {
  render() {
    const { view, onValueChange } = this.props;
    const claim = this.props.data;

    const sponsorVeteranFields = (
      <div className="input-section">
        <h4>Sponsor veteran</h4>
        <FullName
            name={claim.sponsorVeteran.fullName}
            onUserInput={(update) => {onValueChange('sponsorVeteran.fullName', update);}}/>
        <ErrorableTextInput
            label="File number"
            name="sponsorFileNumber"
            field={claim.sponsorVeteran.fileNumber}
            onValueChange={(update) => {onValueChange('sponsorVeteran.fileNumber', update);}}/>
        <ErrorableTextInput
            label="Payee number"
            name="sponsorPayeeNumber"
            field={claim.sponsorVeteran.payeeNumber}
            onValueChange={(update) => {onValueChange('sponsorVeteran.payeeNumber', update);}}/>
      </div>
      );
    const formFields = (
      <div>
        <div className="input-section">
          <ErrorableSelect required
              errorMessage={validateIfDirty(claim.claimType, isNotBlank) ? undefined : 'Please select a claim type'}
              label="Claim type"
              name="claimType"
              options={claimTypes}
              value={claim.claimType}
              onValueChange={(update) => {onValueChange('claimType', update);}}/>
          <ErrorableTextInput
              label="File number"
              name="fileNumber"
              field={claim.fileNumber}
              onValueChange={(update) => {onValueChange('fileNumber', update);}}/>
          {showSomeoneElseServiceQuestion(claim.claimType.value)
            ? <ErrorableRadioButtons
                label="Was this claim for education benefits filed using someone else's service?"
                name="previouslyAppliedWithSomeoneElsesService"
                options={yesNo}
                value={claim.previouslyAppliedWithSomeoneElsesService}
                onValueChange={(update) => {onValueChange('previouslyAppliedWithSomeoneElsesService', update);}}/>
            : null}
        </div>
        {claim.previouslyAppliedWithSomeoneElsesService.value === 'Y' && showSomeoneElseServiceQuestion(claim.claimType.value)
          ? sponsorVeteranFields
          : null}
      </div>
    );

    return view === 'collapsed' ? (<div>{getLabel(claimTypes, claim.claimType.value)}<br/>{claim.fileNumber.value}</div>) : formFields;
  }
}

PreviousClaim.propTypes = {
  data: React.PropTypes.object.isRequired,
  view: React.PropTypes.string,
  onValueChange: React.PropTypes.func.isRequired
};
